import { getAwsSecretValue } from 'get-env';
import { QueryInput, dynamoProvider, helper } from 'core';
import {
  CUSTOMER_COUNTER_INDEX, CUSTOMER_INDEX, PHONE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { Customer } from '../models/Customer';
import logger from '../utils/logger';

export default class CustomerRepositoryImpl implements CustomerRepository {
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
}
