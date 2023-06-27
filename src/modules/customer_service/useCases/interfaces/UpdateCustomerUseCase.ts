import { Customer } from '../../models/Customer';

export interface UpdateCustomerUseCase {
  invoke: (tenantId: string, customer: Customer) => Promise<Customer>;
}
