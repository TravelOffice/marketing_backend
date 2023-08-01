import { getAwsSecretValue } from 'get-env';
import {
  dynamoProvider, helper, logger,
} from 'core';
import { Supplier } from '../models/Supplier';
import { SUPPLIER_INDEX, TENANT_INDEX } from '../utils/constants';
import { SupplierRepository } from './interfaces/SupplierRepository';

export default class SupplierRepositoryImpl
implements SupplierRepository {
  get = async (tenantId: string, supplierId: string) => {
    const table = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${SUPPLIER_INDEX}`;
    const sk = supplierId;

    logger.log(
      `Retrieving Supplier for tenant ${tenantId} with supplier ID [${supplierId}], pk [${pk}], sk [${sk}]`,
    );

    const supplier = await dynamoProvider.getItem<Supplier>(table, pk, sk);
    if (!supplier) throw new Error(`Supplier [${supplierId}] not found`);

    logger.log('Supplier retrieved:', supplier);

    return helper.excludeDataFromObject(supplier) as Supplier;
  };
}
