import { getAwsSecretValue } from 'get-env';
import * as AWS from 'aws';
import { Opportunity } from '../models/Opportunity';
import { dynamoProvider } from '../providers';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import logger from '../utils/logger';
import { QueryInput } from '../providers/DynamoProvider';

export default class OpportunityRepositoryImpl implements OpportunityRepository {
  /**
   * Get a opportunity information in dynamo db
   * @param id Opportunity ID
   * @param tenantId Tenant ID
   * @param leadId Lead/Customer ID
   * @returns All atributes of Opportunity object
   */
  get = async (id: string, tenantId: string, leadId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const item = await dynamoProvider.getItem(
      dynamoTable,
      `Tenant#${tenantId}#Lead#${leadId}`,
      `Tenant#${tenantId}#Opportunity#${id}`,
    );
    if (!item) throw new Error('Opportunity does not exists!');
    const {
      pk, sk, typeGsi, ...opportunity
    } = item;
    return opportunity;
  };

  /**
   * Get a opportunity information in dynamo db
   * @param id Opportunity ID
   * @param tenantId Tenant ID
   * @param assigneeId Assignee ID
   * @returns All atributes of Opportunity object
   */
  getByAssignee = async (id: string, tenantId: string, assigneeId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const item = await dynamoProvider.getItem(
      dynamoTable,
      `Tenant#${tenantId}#Employee#${assigneeId}`,
      `Opportunity#${id}`,
    );
    if (!item) throw new Error('Opportunity does not exists!');
    const {
      pk, sk, typeGsi, ...opportunity
    } = item;
    return opportunity;
  };

  /**
   * Update a opportunity information in dynamo db
   * @param tenantId Tenant ID
   * @param opportunity Opportunity object
   * @returns All atributes of Opportunity object
   */
  update = async (opportunity: Opportunity, tenantId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const { leadId } = opportunity;
    const opportunityId = `${opportunity.createdAt}`;
    const opportunityAssigneeId = `${opportunity.assigneeId}`;

    await dynamoProvider.putItem(
      dynamoTable,
      `Tenant#${tenantId}#Lead#${leadId}`,
      `Tenant#${tenantId}#Opportunity#${opportunityId}`,
      opportunity,
    );
    if (opportunityAssigneeId) {
      await dynamoProvider.putItem(
        dynamoTable,
        `Tenant#${tenantId}#Employee#${opportunityAssigneeId}`,
        `Opportunity#${opportunityId}`,
        opportunity,
      );
      logger.log(`Opportunity change opportunity AssigneeId to ${opportunityAssigneeId}`);
    }

    logger.log(`Opportunity updated with id = ${opportunityId}, leadId = ${leadId}, tenantId = ${tenantId}`);
    return opportunity;
  };

  /**
   * Unassign a opportunity information in dynamo db
   * remove opportunity from Employee partition
   * @param tenantId Tenant ID
   * @param opportunity Opportunity object
   * @returns All atributes of Opportunity object
   */
  unassign = async (id: string, tenantId: string, assigneeId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.deleteItem(
      dynamoTable,
      `Tenant#${tenantId}#Employee#${assigneeId}`,
      `Opportunity#${id}`,
    );
  };

  delete = async (opportunity: Opportunity, tenantId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const { leadId } = opportunity;
    const opportunityId = `${opportunity.createdAt}`;
    const opportunityAssigneeId = `${opportunity.assigneeId}`;

    await dynamoProvider.deleteItem(
      dynamoTable,
      `Tenant#${tenantId}#Lead#${leadId}`,
      `Tenant#${tenantId}#Opportunity#${opportunityId}`,
    );
    if (opportunityAssigneeId) {
      await dynamoProvider.deleteItem(
        dynamoTable,
        `Tenant#${tenantId}#Employee#${opportunityAssigneeId}`,
        `Opportunity#${opportunityId}`,
      );
      logger.log(`Delete Opportunity from Employee ${opportunityAssigneeId} information sucessfully`);
    }

    logger.log(`Delete Opportunity with id = ${opportunityId}, leadId = ${leadId}, tenantId = ${tenantId} successfully`);
  };

  /**
   * Get list opportunities by leadId
   * @param tenantId Tenant ID
   * @param leadId Lead Id
   * @returns All opportunities from lead
   */
  getListByLead = async (tenantId: string, leadId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    const params: QueryInput = {
      TableName: dynamoTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `Tenant#${tenantId}#Lead#${leadId}` },
        ':sk_filter_value': { S: `Tenant#${tenantId}#Opportunity#` },
      },
    };
    const { Items } = await dynamoProvider.rawQuery(params);
    if (Items) {
      return Items.map((item: any) => {
        const opportunity = AWS.DynamoDB.Converter.unmarshall(item);
        const { sk, pk, ...rest } = opportunity;
        return rest as Opportunity;
      });
    }
    return [];
  };

  /**
   * Get list opportunities by assignee ID
   * @param tenantId Tenant ID
   * @param assigneeId Assignee ID
   * @returns All opportunities assigned
   */
  getListByAssignee = async (tenantId: string, assigneeId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    const params: QueryInput = {
      TableName: dynamoTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `Tenant#${tenantId}#Employee#${assigneeId}` },
        ':sk_filter_value': { S: `Tenant#${tenantId}#Opportunity#` },
      },
    };
    const { Items } = await dynamoProvider.rawQuery(params);
    if (Items) {
      return Items.map((item: any) => {
        const opportunity = AWS.DynamoDB.Converter.unmarshall(item);
        const { sk, pk, ...rest } = opportunity;
        return rest as Opportunity;
      });
    }
    return [];
  };
}
