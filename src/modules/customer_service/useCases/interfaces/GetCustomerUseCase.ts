import { Customer } from '../../models/Customer';

export interface GetCustomerUseCase {
  invoke: (tenantId: string, phone: string) => Promise<Customer>;
}
