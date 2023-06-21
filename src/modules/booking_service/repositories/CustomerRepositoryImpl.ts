import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from '../providers';
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
    return dynamoProvider.get(table, pk, sk);
  };

  /**
     *
     * @param tenant Tenant id
     * @param customer Customer information
     * @returns Created customer
     */
  create = async (tenant: string, customer: Customer) => {
    await dynamoProvider.putItem({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Item: {
        pk: `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`,
        sk: `${PHONE_INDEX}#${customer.primaryPhoneNumber}`,
        ...customer,
      },
    });
    return customer;
  };

  /**
     * Method to generate customer code which is user-readable
     * @param tenant id of the tenant
     */
  generateCode = async (tenant: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      const result = await dynamoProvider.update({
        TableName: table,
        Key: {
          pk: `${TENANT_INDEX}#${tenant}`,
          sk: CUSTOMER_COUNTER_INDEX,
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
      logger.log(`Error during increment operation for tenant ${tenant}: ${error}`);
      throw error;
    }
  };
}
