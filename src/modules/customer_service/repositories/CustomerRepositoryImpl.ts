/* eslint-disable @typescript-eslint/no-unused-vars */
import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { Customer } from '../models/Customer';
import {
  ASSIGNEE_INDEX,
  CREATOR_INDEX,
  CUSTOMER_COUNTER_INDEX,
  CUSTOMER_INDEX,
  PHONE_INDEX,
  TENANT_INDEX,
} from '../utils/constants';
import { CustomerRepository } from './interfaces/CustomerRepository';
import logger from '../utils/logger';
import { User } from '../models/User';

type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;
type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;

export default class CustomerRepositoryImpl implements CustomerRepository {
  /**
   * Retrieves a customer for a specific tenant and customer ID.
   * @param tenantId The ID of the tenant.
   * @param customerID The ID of the customer.
   * @returns The retrieved customer.
   */
  get = async (tenantId: string, customerId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving Customer for tenant ${tenantId} with [${customerId}]`);

    const item = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`,
      `${customerId}`,
    );
    if (!item) throw new Error(`Customer [${customerId}] not found`);

    logger.log('Customer retrieved:', item);

    const customer = helper.excludeDataFromObject(item);

    return customer as Customer;
  };

  /**
   * Transform then saving custoer to a data source
   * @param tenantId id of the tenant which the customer to be saved.
   * @param customer the customer object to be saved.
   */
  create = async (tenantId: string, customer: Customer) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`;
    const sk = `${customer.code}`;
    await dynamoProvider.putItem(table, pk, sk, customer);
    return helper.excludeDataFromObject(customer) as Customer;
  };

  /**
   * Query to get all customer from data source
   * @param tenantId The id of the tenant
   */
  list = async (tenantId: string) => {
    const result = await dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`,
      },
    });
    const customers = result.map((item) => helper.excludeDataFromObject(item));
    return customers as Customer[];
  };

  /**
   * Retrieves a list of customers assigned to a specific assignee.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} assigneeId - The ID of the assignee.
   * @returns {Promise<Customer[]>} - A promise that resolves to an array of customers.
   */
  listByAssignee = async (tenantId: string, assigneeId: string) => {
    // Retrieve the name of the DynamoDB table
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    // Set the query parameters to retrieve customers by assignee
    const params: QueryInput = {
      TableName: travelTable, // Name of the DynamoDB table
      IndexName: 'Index5', // Name of the index to query
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi5, :lsi5_filter_value)', // Key condition expression for the query
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`, // Value for the partition key
        ':lsi5_filter_value': `${ASSIGNEE_INDEX}#${assigneeId}`, // Value for the sort key prefix
      },
    };

    // Perform the query to retrieve the customers
    const result = await dynamoProvider.query(params);

    // Exclude sensitive data from the query result and convert to the array of customers
    const customers = result.map((item) => helper.excludeDataFromObject(item));

    return customers as Customer[];
  };

  /**
   * Retrieves a list of customers created by a specific creator.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} creatorId - The ID of the creator.
   * @returns {Promise<Customer[]>} - A promise that resolves to an array of customers.
   */
  listByCreator = async (tenantId: string, creatorId: string) => {
    // Retrieve the name of the DynamoDB table
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    // Set the query parameters to retrieve customers by creator
    const params: QueryInput = {
      TableName: travelTable, // Name of the DynamoDB table
      IndexName: 'Index4', // Name of the index to query
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi4, :lsi4_filter_value)', // Key condition expression for the query
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`, // Value for the partition key
        ':lsi4_filter_value': `${CREATOR_INDEX}#${creatorId}`, // Value for the sort key prefix
      },
    };

    // Perform the query to retrieve the customers
    const result = await dynamoProvider.query(params);

    // Exclude sensitive data from the query result and convert to the array of customers
    const customers = result.map((item) => helper.excludeDataFromObject(item));

    return customers as Customer[];
  };

  findOneByPhone = async (tenantId: string, phone: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
      TableName: travelTable,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi3, :lsi3_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`,
        ':lsi3_filter_value': `${PHONE_INDEX}#${phone}`,
      },
    };
    const items: Customer[] = await dynamoProvider.query(params);
    if (items && items.length) {
      return items[0];
    }
    return undefined;
  };

  update = async (tenantId: string, customerId: string, customer: Partial<Customer>) => {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(customer);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Key: {
        pk: `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`,
        sk: `${customerId}`,
      },
      UpdateExpression: helper.generateUpdateExpression(customer),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as Customer;
  };

  delete = async (tenantId: string, customerId: string) => {
    throw new Error('Method not implemented');
  };

  changeAssignee = async (tenantId: string, customerId: string, assignee: User) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${CUSTOMER_INDEX}`;
    const sk = `${customerId}`;
    const updateExpression = 'SET assigneeId = :assigneeId, assigneeName = :assigneeName, lsi2 = :assigneeLsi, updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':assigneeId': assignee.username,
      ':asigneeName': `${assignee.firstName} ${assignee.lastName}`,
      ':assigneeLsi': `${ASSIGNEE_INDEX}#${assignee}`,
      ':updatedAt': Date.now(),
    };
    const rs = await dynamoProvider.updateItem(
      travelTable,
      pk,
      sk,
      updateExpression,
      expressionAttributeValues,
    );
    return rs.Attributes as Customer;
  };

  /**
   * Increments the counter for a specific tenant which use to
   * generate customer code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generateCustomerCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${CUSTOMER_COUNTER_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}: ${error}`);
      throw error;
    }
  };
}
