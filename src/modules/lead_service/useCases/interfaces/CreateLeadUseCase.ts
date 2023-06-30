import { Lead } from '../../models/Lead';
import { CreateLeadDto } from '../../dto/CreateLeadDto';
import { CognitoUser } from '../../models/User';

export interface CreateLeadUseCase {
  invoke: (currentUser: CognitoUser, lead: CreateLeadDto) => Promise<Lead>;
}
