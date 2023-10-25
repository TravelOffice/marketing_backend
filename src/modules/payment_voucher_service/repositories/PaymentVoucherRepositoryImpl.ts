import { getAwsSecretValue, getEnv } from 'get-env';
import { dynamoProvider, helper, s3Provider } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import {
  CREATED_AT_INDEX, PAYMENT_VOUCHER_INDEX, TENANT_INDEX, TOUR_OPERATION_INDEX,
} from '../utils/constants';
import { PaymentVoucherRepository } from './interfaces/PaymentVoucherRepository';
import logger from '../utils/logger';

export default class PaymentVoucherRepositoryImpl implements PaymentVoucherRepository {
  /**
   * Increments the counter for a specific tenant which use to
   * generate payment voucher code which is user-readable.
   * If the counter attribute doesn't exist, it creates it with an initial value and increments it.
   * @param tenantId The ID of the tenant.
   * @returns The code value.
   */
  generatePaymentVoucherCode = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    try {
      logger.log(`Incrementing counter for tenant ${tenantId}`);
      const code = await helper.generateCode(
        table,
        `${TENANT_INDEX}#${tenantId}`,
        `${PAYMENT_VOUCHER_INDEX}`,
      );
      return code.toString();
    } catch (error) {
      logger.log(`Error during increment operation for tenant ${tenantId}:`, error);
      throw error;
    }
  };

  /**
   * Retrieves a list of payment vouchers for a specific tenant.
   * @param tenantId The ID of the tenant.
   * @returns The list of payment vouchers
   */
  list = async (tenantId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: table,
      IndexName: 'Index1',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi1, :lsi1_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`,
        ':lsi1_filter_value': `${CREATED_AT_INDEX}#`,
      },
    };

    logger.log(`Listing payment vouchers for tenant ${tenantId}`);
    logger.log('Query parameters:', params);

    const paymentVouchers: PaymentVoucher[] = await dynamoProvider.query(params);

    // Logging the results
    logger.log(`Found ${paymentVouchers.length} payment vouchers for tenant ${tenantId}`);

    return paymentVouchers;
  };

  /**
   * Retrieves a list of payment vouchers for a specific tenant belong to operation tour.
   * @param tenantId The ID of the tenant.
   * @param tourId The Operation Tour ID
   * @returns The list of payment vouchers
   */
  listByTour = async (tenantId: string, tourId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params = {
      TableName: table,
      IndexName: 'Index5',
      KeyConditionExpression: 'pk = :pk AND begins_with(lsi5, :lsi5_filter_value)',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`,
        ':lsi5_filter_value': `${TOUR_OPERATION_INDEX}#${tourId}`,
      },
    };

    logger.log(`Listing payment vouchers for tenant ${tenantId} belong to ${tourId}`);
    logger.log('Query parameters:', params);

    const paymentVouchers: PaymentVoucher[] = await dynamoProvider.query(params);

    // Logging the results
    logger.log(`Found ${paymentVouchers.length} payment vouchers for tenant ${tenantId}`);

    return paymentVouchers;
  };

  /**
   * Retrieves a specific payment voucher for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the payment voucher.
   * @returns The payment voucher.
   * @throws Error if the payment voucher is not found.
   */
  get = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');

    logger.log(`Retrieving Payment voucher for tenant ${tenantId} with [${id}]`);

    const paymentVoucher = await dynamoProvider.getItem(
      table,
      `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`,
      `${id}`,
    );
    if (!paymentVoucher) throw new Error(`Payment voucher [${id}] not found`);

    logger.log('Payment voucher retrieved:', paymentVoucher);

    return paymentVoucher as PaymentVoucher;
  };

  /**
   * Creates a new payment voucher for a tenant.
   * @param tenantId The ID of the tenant.
   * @param paymentVoucher The payment voucher object.
   * @returns The created payment voucher.
   */
  create = async (tenantId: string, paymentVoucher: PaymentVoucher) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`;
    const sk = `${paymentVoucher.code}`;

    logger.log(`Creating Payment voucher for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Payment voucher:`, paymentVoucher);

    await dynamoProvider.putItem(table, pk, sk, paymentVoucher);

    logger.log(`Payment voucher was created successfully for tenant ${tenantId}`);

    return paymentVoucher;
  };

  /**
   * Updates an existing payment voucher for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the payment voucher.
   * @param paymentVoucher The updated Payment voucher object.
   * @returns The updated payment voucher.
   * @throws Error if the payment voucher is not found.
   */
  update = async (tenantId: string, id: string, paymentVoucher: PaymentVoucher) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`;
    const sk = `${id}`;

    logger.log(`Updating Payment voucher for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);
    logger.log(`Tenant ${tenantId} - Payment voucher:`, paymentVoucher);

    await dynamoProvider.putItem(table, pk, sk, paymentVoucher);

    logger.log(`Payment voucher was updated successfully for tenant ${tenantId}`);

    return paymentVoucher;
  };

  /**
   * Deletes a payment voucher for a tenant.
   * @param tenantId The ID of the tenant.
   * @param id The ID of the payment voucher to delete.
   * @returns The ID of the deleted payment voucher.
   */
  delete = async (tenantId: string, id: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${PAYMENT_VOUCHER_INDEX}`;
    const sk = `${id}`;

    logger.log(`Deleting Payment voucher for tenant ${tenantId} with pk: ${pk}, sk: ${sk}`);

    await dynamoProvider.deleteItem(table, pk, sk);

    logger.log(`Payment voucher deleted successfully for tenant ${tenantId}`);

    return id;
  };

  /**
   * Delete a payment voucher attachment
   * @param attachment The cdn link of attachment file
   */
  deleteAttachment = async (attachment: string) => {
    const cdnUrl = await getAwsSecretValue('CHAT_FILE_CDN');
    const s3Bucket = getEnv('ATTACHMENT_BUCKET');
    const s3Key = attachment.replace(`${cdnUrl}/`, '');
    await s3Provider.deleteObject(s3Bucket, s3Key);
  };
}
