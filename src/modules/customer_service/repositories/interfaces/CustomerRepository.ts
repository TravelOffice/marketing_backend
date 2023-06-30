import { Customer } from '../../models/Customer';

export interface CustomerRepository {
  get: (tenantId: string, customerId: string) => Promise<Customer>,
  create: (tenantId: string, customer: Customer) => Promise<Customer>,
  list: (tenantId: string) => Promise<Customer[]>,
  listByAssignee: (tenantId: string, assigneeId: string) => Promise<Customer[]>,
  listByCreator: (tennatId: string, creatorId: string) => Promise<Customer[]>,
  findOneByPhone : (tenantId: string, phone: string) => Promise<Customer | undefined>,
  update: (tenantId: string, customerId: string, customer: Partial<Customer>) => Promise<Customer>,
  delete: (tenantId: string, customerId: string) => Promise<void>,
  changeAssignee: (tenantId: string, CustomerId: string, saleId: string) => Promise<Customer>,
  generateCustomerCode: (tenantId: string) => Promise<string>,
}
