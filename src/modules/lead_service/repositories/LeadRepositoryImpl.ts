/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAwsSecretValue } from 'get-env';
import {
  dynamoProvider, helper, PaginationParams, QueryInput, ReturnValue, UpdateItemInput,
} from 'core';
import { Lead, LeadStatus } from '../models/Lead';

import {
  ASSIGNEE_INDEX,
  LEAD_COUNTER_INDEX,
  LEAD_INDEX,
  LEAD_STATUS_INDEX,
  STATUS_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { LeadRepository } from './interfaces/LeadRepository';
import { User } from '../models/User';

export default class LeadRepositoryImpl implements LeadRepository {
  getById = async (tenantId: string, leadId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`;
    const sk = `${leadId}`;
    return dynamoProvider.getItem<Lead>(travelTable, pk, sk);
  };

  /**
   * Transform then saving lead to a data source
   * @param tenantId id of the tenant which the lead to be saved.
   * @param lead the Lead object to be saved.
   */
  create = async (tenantId: string, lead: Lead) => {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`,
      `${lead.code}`,
      lead,
    );
    return lead;
  };

  /**
   * Query to get all leads from data source, sort by createdAt by default.
   * @param tenantId id of the tenant
   */
  list = async (tenantId: string) => this.queryLeads({
    TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
    KeyConditionExpression: 'pk = :pk',
    IndexName: 'Index1',
    ExpressionAttributeValues: {
      ':pk': `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`,
    },
  });

  availableListForMarketplace = async (tenant: string, paginationParams: PaginationParams) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const queryParams = {
      TableName: travelTable,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk and lsi3 = :lsi3',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenant}#${LEAD_INDEX}`,
        ':lsi3': `${LEAD_STATUS_INDEX}#${LeadStatus.PROCESSING}`,
      },
    };
    return dynamoProvider.queryPagination<Lead>(
      queryParams,
      paginationParams,
    );
  };

  /**
   * Query to get all leads which is assigned to given employee
   * @param tenantId id of the tenant
   * @param assigneeId id of the employee
   */
  listByAssignee = async (tenantId: string, assigneeId: string) => this.queryLeads({
    TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
    IndexName: 'Index4',
    KeyConditionExpression: 'pk = :pk AND begins_with(lsi4, :lsi4)',
    ExpressionAttributeValues: {
      ':pk': `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`,
      ':lsi4': `${ASSIGNEE_INDEX}#${assigneeId}`,
    },
  });

  get = async (tenantId: string, leadId: string) => {
    throw new Error('Method not implemented');
  };

  update = async (tenantId: string, leadId: string, lead: Partial<Lead>) => {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(lead);
    const result = await dynamoProvider.updateItemWithPrebuiltExpression({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Key: {
        pk: `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`,
        sk: `${leadId}`,
      },
      UpdateExpression: helper.generateUpdateExpression(lead),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as Lead;
  };

  delete = async (tenantId: string, leadId: string) => {
    throw new Error('Method not implemented');
  };

  changeAssignee = async (tenantId: string, leadId: string, assignee: User) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`;
    const sk = `${leadId}`;
    const updateParams: UpdateItemInput = {
      TableName: travelTable,
      Key: {
        pk,
        sk,
      },
      UpdateExpression: 'SET assigneeId = :assigneeId, assigneeName = :asigneeName, lsi4 = :assigneeLsi, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':assigneeId': assignee.username,
        ':asigneeName': `${assignee.firstName} ${assignee.lastName}`,
        ':assigneeLsi': `${ASSIGNEE_INDEX}#${assignee.username}`,
        ':updatedAt': Date.now(),
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const rs = await dynamoProvider.updateItemWithPrebuiltExpression(updateParams);
    return rs.Attributes as Lead;
  };

  /**
   * Change lead status
   * @param tenantId The id of tenant
   * @param leadId The id of lead
   * @param status The status of lead
   * @returns The lead object after changing status
   */
  changeStatus = async (tenantId: string, leadId: string, status: LeadStatus) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`;
    const sk = `${leadId}`;
    const updateParams: UpdateItemInput = {
      TableName: travelTable,
      Key: {
        pk,
        sk,
      },
      UpdateExpression: 'SET leadStatus = :status, lsi3 = :statusLsi, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': status,
        ':statusLsi': `${STATUS_INDEX}#${status}`,
        ':updatedAt': Date.now(),
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const rs = await dynamoProvider.updateItemWithPrebuiltExpression(updateParams);
    return rs.Attributes as Lead;
  };

  /**
   * Cancels a lead in the travel application.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} leadId - The ID of the lead to cancel.
   * @param {string} cancelledReason - The reason for cancellation.
   * @returns {Lead} - The updated lead after cancellation.
   * @throws {Error} - If an error occurs during the cancellation process.
   */
  cancel = async (tenantId: string, leadId: string, cancelledReason: string): Promise<Lead> => {
    try {
      // Log the start of the cancellation process
      logger.log('Cancellation process started.');

      // Log the tenantId being used for filtering
      logger.log(`Filtering leads by tenantId: ${tenantId}`);

      // Retrieve the name of the DynamoDB table where travel data is stored
      const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

      // Construct the partition key and sort key for the lead in the DynamoDB table
      const pk = `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`;
      const sk = `${leadId}`;

      // Define the parameters for updating the lead in the DynamoDB table
      const updateParams = {
        TableName: travelTable,
        Key: {
          pk,
          sk,
        },
        UpdateExpression: 'SET leadStatus = :status, lsi1 = :statusLsi, cancelledReason = :cancelledReason, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':status': LeadStatus.CANCEL,
          ':statusLsi': `${STATUS_INDEX}#${LeadStatus.CANCEL}`,
          ':cancelledReason': cancelledReason,
          ':updatedAt': Date.now(),
        },
        ReturnValues: 'UPDATED_NEW' as ReturnValue,
      };

      // Update the lead in the DynamoDB table and retrieve the updated attributes
      const rs = await dynamoProvider.updateItemWithPrebuiltExpression(updateParams);

      // Log the success of the cancellation process
      logger.log('[]Cancellation process completed successfully.');

      // Return the updated lead attributes
      return rs.Attributes as Lead;
    } catch (error) {
      // Log any errors that occur during the cancellation process
      logger.log(`Error canceling lead: ${error}`);

      // Rethrow the error to be handled by the caller
      throw error;
    }
  };

  /**
   * Method to generate lead code which is user-readable
   * @param tenantId id of the tenant
   */
  generateLeadCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      const result = await dynamoProvider.updateItemWithPrebuiltExpression({
        TableName: table,
        Key: {
          pk: `${TENANT_INDEX}#${tenantId}`,
          sk: LEAD_COUNTER_INDEX,
        },
        UpdateExpression: 'SET incrIndex = if_not_exists(incrIndex, :start) + :increment',
        ExpressionAttributeValues: {
          ':start': 0, // Initial value if the attribute doesn't exist
          ':increment': 1, // Increment value
        },
        ReturnValues: 'UPDATED_NEW',
      });
      const count = result.Attributes!.incrIndex as number;
      return count.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}: ${error}`);
      throw error;
    }
  };

  private async queryLeads(input: QueryInput) {
    const items = await dynamoProvider.query(input);
    const leads = items.map((item) => helper.excludeDataFromObject(item));
    return leads as Lead[];
  }
}
