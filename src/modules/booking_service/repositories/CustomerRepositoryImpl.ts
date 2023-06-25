import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import {
  CUSTOMER_COUNTER_INDEX, CUSTOMER_INDEX, PHONE_INDEX, TENANT_INDEX,
} from '../utils/constants';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { Customer } from '../models/Customer';
import logger from '../utils/logger';

export default class CustomerRepositoryImpl implements CustomerRepository {
  /**
     * Find customer by email and phone number
     * @param email Email of customer
     * @param phone Phone number
     * @returns Customer object
     */
  findOneByPhone = async (tenant: string, phone: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;
    const sk = `${PHONE_INDEX}#${phone}`;
    return dynamoProvider.getItem(table, pk, sk);
  };

  /**
     *
     * @param tenant Tenant id
     * @param customer Customer information
     * @returns Created customer
     */
  create = async (tenant: string, customer: Customer) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    await dynamoProvider.putItem(
      table,
      `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`,
      `${PHONE_INDEX}#${customer.primaryPhoneNumber}`,
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
