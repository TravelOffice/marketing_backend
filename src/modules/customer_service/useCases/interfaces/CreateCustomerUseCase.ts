import { Customer } from '../../models/Customer';
import { CognitoUser } from '../../models/User';

export interface CreateCustomerUseCase {
  invoke: (currentUser: CognitoUser, customer: Customer) => Promise<Customer>;
}
