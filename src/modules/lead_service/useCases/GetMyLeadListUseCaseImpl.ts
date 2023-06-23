import { GetMyLeadListUseCase } from './interfaces/GetMyLeadListUseCase';
import { User } from '../models/User';
import { leadRepository } from '../repositories';

export default class GetMyLeadListUseCaseImpl implements GetMyLeadListUseCase {
  invoke = async (
    currentUser: User,
  ) => leadRepository.listByAssignee(currentUser.tenant, currentUser.username);
}
