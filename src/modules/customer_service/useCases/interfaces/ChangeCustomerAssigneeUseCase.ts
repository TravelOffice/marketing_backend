import { Customer } from '../../models/Customer';

export interface ChangeCustomerAssigneeUseCase {
    invoke: (tenantId: string, customerId: string, assignee: string) => Promise<Customer>
}
