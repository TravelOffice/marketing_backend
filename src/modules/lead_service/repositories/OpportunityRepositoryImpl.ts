import * as AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Opportunity } from '../models/Opportunity';
import { dynamoProvider } from '../providers';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import logger from '../utils/logger';

type QueryInput = AWS.DynamoDB.QueryInput;

export default class OpportunityRepositoryImpl implements OpportunityRepository {
  /**
   * Get all opportunity information in dynamo db which belong to Lead
   * @param tenantId Tenant ID
   * @param leadId Lead/Customer ID
   * @returns All atributes of Array Opportunity object
   */
  getAllByLeadId = async (tenantId: string, leadId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: dynamoTable,
      KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
      ExpressionAttributeValues: {
        ':pk': { S: `Tenant#${tenantId}#Lead#${leadId}` },
        ':sk': { S: `Tenant#${tenantId}#Opportunity` },
      },
    };
    return dynamoProvider.query(params) || [];
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

    await dynamoProvider.putItem(
      dynamoTable,
      `Tenant#${tenantId}#Lead#${leadId}`,
      `Tenant#${tenantId}#Opportunity#${opportunityId}`,
      opportunity,
    );

    logger.log(`Opportunity updated with id = ${opportunityId}, leadId = ${leadId}, tenantId = ${tenantId}`);
    return opportunity;
  };
}
