import { getAwsSecretValue } from 'get-env';
import AWS from 'aws';
import { Opportunity, OpportunityStatus } from '../models/Opportunity';
import { dynamoProvider } from '../providers';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import logger from '../utils/logger';
import { QueryInput } from '../providers/DynamoProvider';
import {
  EMPLOYEE_INDEX,
  LEAD_INDEX,
  OPPORTUNITY_INDEX,
  TENANT_INDEX,
} from '../utils/constants';

export default class OpportunityRepositoryImpl implements OpportunityRepository {
  /**
   * Create new opportunity, save to database
   * @param tenantId The id of tenant which the opportunity belongs to.
   * @param leadId The id of the lead associate to the opportunity.
   * @param employeeId The id of the employee who creates the opportunity.
   * @param opportunity The opportunity information to be created.
   */
  create = async (
    tenantId: string,
    leadId: string,
    employeeId: string,
    opportunity: Opportunity,
  ) => {
    // Save to Lead partition
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const createdAt = Date.now();
    const opportunityId = `${createdAt}`;
    const opportunityToCreate = {
      ...opportunity,
      id: opportunityId,
      createdAt,
      updatedAt: createdAt,
    };
    await dynamoProvider.putItem(dynamoTable, `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}`, `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}#${opportunityId}`, {
      ...opportunityToCreate,
      typeGsi: `${OPPORTUNITY_INDEX}#${TENANT_INDEX}#${tenantId}`,
      lsi1: `${OPPORTUNITY_INDEX}#${opportunity.status}`,
    });
    // Save to Employee partition1
    await dynamoProvider.putItem(dynamoTable, `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${employeeId}`, `${OPPORTUNITY_INDEX}#${opportunityId}`, {
      ...opportunityToCreate,
      lsi1: `${OPPORTUNITY_INDEX}#${opportunity.status}`,
    });
    return opportunityToCreate;
  };

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
      `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}`,
      `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}#${id}`,
    );
    if (!item) {
      return undefined;
    }
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
      `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${assigneeId}`,
      `${OPPORTUNITY_INDEX}#${id}`,
    );
    if (!item) {
      return undefined;
    }
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
    const newOpportunity = {
      ...opportunity,
      lsi1: `${OPPORTUNITY_INDEX}#${opportunity.status}`,
      updatedAt: Date.now(),
    };

    await dynamoProvider.putItem(
      dynamoTable,
      `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}`,
      `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}#${opportunityId}`,
      newOpportunity,
    );
    if (opportunityAssigneeId) {
      await dynamoProvider.putItem(
        dynamoTable,
        `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${opportunityAssigneeId}`,
        `${OPPORTUNITY_INDEX}#${opportunityId}`,
        newOpportunity,
      );
      logger.log(`Opportunity change opportunity AssigneeId to ${opportunityAssigneeId}`);
    }

    logger.log(`Opportunity updated with id = ${opportunityId}, leadId = ${leadId}, tenantId = ${tenantId}`);
    return newOpportunity;
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
      `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${assigneeId}`,
      `${OPPORTUNITY_INDEX}#${id}`,
    );
  };

  delete = async (opportunity: Opportunity, tenantId: string) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const { leadId } = opportunity;
    const opportunityId = `${opportunity.createdAt}`;
    const opportunityAssigneeId = `${opportunity.assigneeId}`;

    await dynamoProvider.deleteItem(
      dynamoTable,
      `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}`,
      `${TENANT_INDEX}#${tenantId}#${OPPORTUNITY_INDEX}#${opportunityId}`,
    );
    if (opportunityAssigneeId) {
      await dynamoProvider.deleteItem(
        dynamoTable,
        `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${opportunityAssigneeId}`,
        `${OPPORTUNITY_INDEX}#${opportunityId}`,
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
  getListByLead = async (tenantId: string, leadId: string, status?: OpportunityStatus) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLsi = `${OPPORTUNITY_INDEX}#`;
    if (status) {
      filterLsi = `${OPPORTUNITY_INDEX}#${status}`;
    }

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}#${leadId}` },
        ':lsi_filter_value': { S: filterLsi },
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
  getListByAssignee = async (tenantId: string, assigneeId: string, status?: OpportunityStatus) => {
    const dynamoTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    let filterLsi = `${OPPORTUNITY_INDEX}#`;
    if (status) {
      filterLsi = `${OPPORTUNITY_INDEX}#${status}`;
    }

    const params: QueryInput = {
      TableName: dynamoTable,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi_filter_value)',
      ExpressionAttributeValues: {
        ':pk': { S: `${TENANT_INDEX}#${tenantId}#${EMPLOYEE_INDEX}#${assigneeId}` },
        ':lsi_filter_value': { S: filterLsi },
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
