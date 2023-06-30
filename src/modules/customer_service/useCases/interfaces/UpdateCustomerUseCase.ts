import { UpdateCustomerDto } from '../../dto/UpdateCustomerDto';
import { Customer } from '../../models/Customer';

export interface UpdateCustomerUseCase {
  invoke: (
    tenantId: string, customerId: string, updateCustomerDto: UpdateCustomerDto,
  ) => Promise<Customer>;
}
