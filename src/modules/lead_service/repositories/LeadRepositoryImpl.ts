/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Lead, LeadStatus } from '../models/Lead';
import { dynamoProvider } from '../providers';
import {
  LEAD_COUNTER_INDEX, LEAD_INDEX, STATUS_INDEX, TENANT_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { LeadRepository } from './interfaces/LeadRepository';

type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;

export default class LeadRepositoryImpl implements LeadRepository {
  getById = async (tenantId: string, leadId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${LEAD_INDEX}#${leadId}`;
    return dynamoProvider.get(travelTable, pk, sk);
  };

  /**
   * Transform then saving lead to a data source
   * @param tenantId id of the tenant which the lead to be saved.
   * @param lead the Lead object to be saved.
   */
  create = async (tenantId: string, lead: Lead) => {
    await dynamoProvider.putItem({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Item: {
        pk: `${TENANT_INDEX}#${tenantId}`,
        sk: `${LEAD_INDEX}#${lead.createdAt}`,
        ...lead,
      },
    });
    return lead;
  };

  list = async (tenantId: string) => {
    throw new Error('Method not implemented');
  };

  get = async (tenantId: string, leadId: string) => {
    throw new Error('Method not implemented');
  };

  update = async (tenantId: string, leadId: string, lead: Lead) => {
    throw new Error('Method not implemented');
  };

  delete = async (tenantId: string, leadId: string) => {
    throw new Error('Method not implemented');
  };

  changeAssignee = async (tenantId: string, leadId: string, saleId: string) => undefined;

  /**
   * Change lead status
   * @param tenantId The id of tenant
   * @param leadId The id of lead
   * @param status The status of lead
   * @returns The lead object after changing status
   */
  changeStatus = async (tenantId: string, leadId: string, status: LeadStatus) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}`;
    const sk = `${LEAD_INDEX}#${leadId}`;
    const updateParams: UpdateItemInput = {
      TableName: travelTable,
      Key: {
        pk,
        sk,
      },
      UpdateExpression: 'SET leadStatus = :status, lsi1 = :statusLsi, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':status': status,
        ':statusLsi': `${LEAD_INDEX}#${STATUS_INDEX}#${status}`,
        ':updatedAt': Date.now(),
      },
      ReturnValues: 'UPDATED_NEW',
    };
    const rs = await dynamoProvider.update(updateParams);
    return rs.Attributes as Lead;
  };

  /**
   * Cancels a lead in the travel application.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} leadId - The ID of the lead to cancel.
   * @param {string} reason - The reason for cancellation.
   * @returns {Lead} - The updated lead after cancellation.
   * @throws {Error} - If an error occurs during the cancellation process.
   */
  cancel = async (tenantId: string, leadId: string, reason: string) => {
    try {
      // Log the start of the cancellation process
      logger.log('Cancellation process started.');

      // Log the tenantId being used for filtering
      logger.log(`Filtering leads by tenantId: ${tenantId}`);

      // Retrieve the name of the DynamoDB table where travel data is stored
      const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

      // Construct the partition key and sort key for the lead in the DynamoDB table
      const pk = `${TENANT_INDEX}#${tenantId}`;
      const sk = `${LEAD_INDEX}#${leadId}`;

      // Define the parameters for updating the lead in the DynamoDB table
      const updateParams: UpdateItemInput = {
        TableName: travelTable,
        Key: {
          pk,
          sk,
        },
        UpdateExpression: 'SET leadStatus = :status, lsi1 = :statusLsi, reason = :reason, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':status': LeadStatus.CANCEL,
          ':statusLsi': `${LEAD_INDEX}#${STATUS_INDEX}#${LeadStatus.CANCEL}`,
          ':reason': reason,
          ':updatedAt': Date.now(),
        },
        ReturnValues: 'UPDATED_NEW',
      };

      // Update the lead in the DynamoDB table and retrieve the updated attributes
      const rs = await dynamoProvider.update(updateParams);

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
      const result = await dynamoProvider.update({
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
}
