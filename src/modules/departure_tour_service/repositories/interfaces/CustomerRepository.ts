import { Customer } from '../../models/customer/Customer';

export interface CustomerRepository {
  buildBatchWriteCustomers: (
    tenant: string,
    customer: Partial<Customer>[],
  ) => { PutRequest: { Item: any } }[],
  generateCustomerCode: (tenantId: string, quantity: number) => Promise<number>,
}
