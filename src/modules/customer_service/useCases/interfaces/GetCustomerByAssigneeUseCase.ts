import { Customer } from '../../models/Customer';

export interface GetCustomerByAssigneeUseCase {
  invoke: (tenantId: string, assigneeId: string) => Promise<Array<Customer>>;
}
