import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { Opportunity } from '../models/Opportunity';
import { dynamoProvider } from '../providers';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import logger from '../utils/logger';
import { LEAD_INDEX, OPPORTUNITY_INDEX, TENANT_INDEX } from '../utils/constants';

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
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}` },
        ':sk': { S: `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}` },
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
      `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}`,
      `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}#${opportunityId}`,
      opportunity,
    );

    logger.log(`Opportunity updated with id = ${opportunityId}, leadId = ${leadId}, tenantId = ${tenantId}`);
    return opportunity;
  };
}
