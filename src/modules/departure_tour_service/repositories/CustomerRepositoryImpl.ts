import { getAwsSecretValue } from 'get-env';
import { helper } from 'core';
import {
  ASSIGNEE_INDEX,
  CREATED_AT_INDEX,
  CREATOR_INDEX,
  CUSTOMER_COUNTER_INDEX,
  CUSTOMER_INDEX,
  PHONE_INDEX,
  TENANT_INDEX,
  UPDATED_AT_INDEX,
} from '../utils/constants';
import { CustomerRepository } from './interfaces/CustomerRepository';
import { Customer, CustomerLevel } from '../models/customer/Customer';
import logger from '../utils/logger';

export default class CustomerRepositoryImpl implements CustomerRepository {
  /**
   * Builds a batch write request for updating customer records in the DynamoDB table.
   *
   * @param {string} tenant - The identifier for the tenant.
   * @param {Customer[]} customers - An array of customer objects to be updated.
   * @returns {PutRequest[]} - An array of PutRequest objects for the batch write operation.
   */
  buildBatchWriteCustomers = (tenant: string, customers: Partial<Customer>[]) => {
    // Construct the partition key for customers
    const pk = `${TENANT_INDEX}#${tenant}#${CUSTOMER_INDEX}`;

    // Map each customer to a PutRequest for batch write
    return customers.map((customer) => {
      // Construct the sort key for the customer
      const sk = `${customer.code}`;

      // Get the current timestamp
      const now = Date.now();

      // Construct the Item object for the PutRequest
      return {
        PutRequest: {
          Item: {
            ...customer,
            pk,
            sk,
            lsi1: `${CREATED_AT_INDEX}#${now}`, // createdAt lsi
            lsi2: `${UPDATED_AT_INDEX}#${now}`, // updatedAt lsi
            lsi3: `${PHONE_INDEX}#${customer.primaryPhoneNumber}`,
            lsi4: `${CREATOR_INDEX}#${customer.creatorId}`,
            lsi5: `${ASSIGNEE_INDEX}#${customer.creatorId}`,
            level: CustomerLevel.STANDARD,
            createdAt: now,
            updatedAt: now,
          },
        },
      };
    });
  };

  /**
   * Increments the counter for a specific tenant which use to
   * generate customer code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @param quantity The quantity of the generating code.
   * @returns The code value.
   */
  generateCustomerCode = async (tenantId: string, quantity: number) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      return helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${CUSTOMER_COUNTER_INDEX}`,
        quantity,
      );
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}: ${error}`);
      throw error;
    }
  };
}
