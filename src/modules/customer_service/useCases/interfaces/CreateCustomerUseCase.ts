import { Customer } from '../../models/Customer';
import { User } from '../../models/User';

export interface CreateCustomerUseCase {
  invoke: (currentUser: User, customer: Customer) => Promise<Customer>;
}
