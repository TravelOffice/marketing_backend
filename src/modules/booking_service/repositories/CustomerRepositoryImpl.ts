import { getAwsSecretValue } from 'get-env';
import {
  dynamoProvider, helper, QueryInput, UpdateItemInput,
} from 'core';
import {
  CUSTOMER_COUNTER_INDEX, CUSTOMER_INDEX, PHONE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { Customer, LatestBooking } from '../models/Customer';
import logger from '../utils/logger';

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
   * Find customer by email and phone number
   * @param tenant Tenant id
   * @param phone Phone number
   * @returns Customer object
   */
  findOneByPhone = async (tenant: string, phone: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;
    const params: QueryInput = {
      TableName: table,
      IndexName: 'Index3',
      KeyConditionExpression: 'pk = :pk AND lsi3 = :lsi3_filter_value',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':lsi3_filter_value': `${PHONE_INDEX}#${phone}`,
      },
    };

    const customers = await dynamoProvider.query(params);
    if (!customers.length) {
      logger.log(`Customer with pk ${pk} sk ${phone} is not existed.`);
      return undefined;
    }

    // Formatting the items and adding the id property
    const customer = helper.excludeDataFromObject(customers.pop()) as Customer;
    logger.log(`Returning customer with pk ${pk} sk ${phone} ${JSON.stringify(customer)}`);
    return customer;
  };

  /**
   * Update customer
   * @param tenant Tenant id
   * @param customerId ID of Customer
   * @returns customer Data to update
   */
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

  /**
   * Create new customer
   * @param tenant Tenant id
   * @param customer Customer information
   * @returns Created customer
   */
  create = async (tenant: string, customer: Customer) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(
      table,
      `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`,
      customer.code,
      customer,
    );
    return customer;
  };

  /**
   * Method to generate customer code which is user-readable
   * @param tenant id of the tenant
   */
  generateCode = async (tenant: string) => {
    try {
      const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
      const count = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenant}`,
        CUSTOMER_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenant}: ${error}`);
      throw error;
    }
  };

  /**
   * Updates the revenue of a customer.
   *
   * @param {string} tenant - The ID of the tenant.
   * @param {string} customerId - The ID of the customer.
   * @param {number} bookingRevenue - The revenue to be added to the customer's existing revenue.
   * @returns {Promise<number>} - A promise that resolves to the updated revenue of the customer.
   */
  updateRevenue = async (tenant: string, customerId: string, bookingRevenue: number) => {
    logger.log('Update revenue process started.');

    // Retrieve the name of the DynamoDB table
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    // Construct the partition key and sort key for the customer
    const pk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;
    const sk = customerId;

    // Set the update parameters to increase the customer's revenue
    const updateParams: UpdateItemInput = {
      TableName: travelTable, // Name of the DynamoDB table
      Key: {
        pk, // Partition key value
        sk, // Sort key value
      },
      UpdateExpression: 'SET revenue = if_not_exists(incrIndex, :start) + :bookingRevenue, updatedAt = :updatedAt', // Update expression
      ExpressionAttributeValues: {
        ':start': 0,
        ':bookingRevenue': bookingRevenue, // Value for the booking revenue
        ':updatedAt': Date.now(), // Value for the updatedAt timestamp
      },
      ReturnValues: 'UPDATED_NEW', // Specify to return the updated attributes
    };

    // Perform the update operation
    await dynamoProvider.rawUpdateItem(updateParams);
  };

  /**
   * Updates the latest booking information for a customer.
   *
   * @param {string} tenant - The ID of the tenant.
   * @param {string} customerId - The ID of the customer.
   * @param {LatestBooking} booking - The latest booking information to be updated.
   */
  updateLatestBooking = async (tenant: string, customerId: string, booking: LatestBooking) => {
    logger.log('Update revenue process started.');

    // Retrieve the name of the DynamoDB table
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    // Construct the partition key and sort key for the customer
    const pk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;
    const sk = customerId;

    // Set the update parameters to update the latest booking and the updatedAt timestamp
    const updateParams: UpdateItemInput = {
      TableName: travelTable, // Name of the DynamoDB table
      Key: {
        pk, // Partition key value
        sk, // Sort key value
      },
      UpdateExpression: 'SET latestBooking = :booking, updatedAt = :updatedAt', // Update expression
      ExpressionAttributeValues: {
        ':booking': booking, // Value for the booking information
        ':updatedAt': Date.now(), // Value for the updatedAt timestamp
      },
      ReturnValues: 'UPDATED_NEW', // Specify to return the updated attributes
    };

    // Perform the update operation
    await dynamoProvider.rawUpdateItem(updateParams);
  };
}
