import { GetMyLeadListUseCase } from './interfaces/GetMyLeadListUseCase';
import { CognitoUser } from '../models/User';
import { leadRepository } from '../repositories';

export default class GetMyLeadListUseCaseImpl implements GetMyLeadListUseCase {
  invoke = async (
    currentUser: CognitoUser,
  ) => leadRepository.listByAssignee(currentUser.tenant, currentUser.username);
}
