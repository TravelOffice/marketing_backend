import AWS from 'aws';
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { PaymentVoucher } from '../models/PaymentVoucher';
import { PAYMENT_VOUCHER_INDEX, TENANT_INDEX, TOUR_OPERATION_INDEX } from '../utils/constants';
import { PaymentVoucherRepository } from './interfaces/PaymentVoucherRepository';
import logger from '../utils/logger';

type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;

export default class PaymentVoucherRepositoryImpl implements PaymentVoucherRepository {
  /**
   * Retrieves a list of payment vouchers for a specific tenant belong to operation tour.
   * @param tenantId The ID of the tenant.
   * @param tourId The Operation Tour ID
   * @returns The list of payment vouchers
   */
  listByTour = async (tenantId: string, tourId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const params: QueryInput = {
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
}
