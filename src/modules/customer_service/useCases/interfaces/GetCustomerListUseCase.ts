import { Customer } from '../../models/Customer';

export interface GetCustomerListUseCase {
  invoke: (tenantId: string) => Promise<Array<Customer>>;
}
