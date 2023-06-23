import { User } from '../../models/User';
import { Lead } from '../../models/Lead';

export interface GetMyLeadListUseCase {
  invoke: (currentUser: User) => Promise<Lead[]>,
}
