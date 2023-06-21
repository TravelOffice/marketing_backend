import { Lead } from '../../models/Lead';
import { CreateLeadDto } from '../../dto/CreateLeadDto';
import { User } from '../../models/User';

export interface CreateLeadUseCase {
  invoke: (currentUser: User, lead: CreateLeadDto) => Promise<Lead>;
}
