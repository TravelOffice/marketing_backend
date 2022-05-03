import CreateLeadUseCaseImpl from './CreateLeadUseCaseImpl';
import UpdateLeadUseCaseImpl from './UpdateLeadUseCaseImpl';
import GetLeadListByAssigneeUseCaseIpml from './GetLeadListByFieldUseCaseImpl';
import GetLeadListByTenantUseCaseIpml from './GetLeadListByTenantUseCaseImpl';
import GetLeadUseCaseImpl from './GetLeadUseCaseImpl';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';
import { GetLeadListByAssigneeUseCase } from './interfaces/GetLeadListByAssignee';
import { GetLeadListByTenantUseCase } from './interfaces/GetLeadListByTenant';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

interface UseCases {
  createLeadUseCase: CreateLeadUseCase,
  updateLeadUseCase: UpdateLeadUseCase,
  getLeadUseCase: GetLeadUseCase,
  getLeadListByAssigneeUseCase: GetLeadListByAssigneeUseCase,
  getLeadListByTenantUseCase: GetLeadListByTenantUseCase,
}

const useCases : UseCases = {
  createLeadUseCase: new CreateLeadUseCaseImpl(),
  updateLeadUseCase: new UpdateLeadUseCaseImpl(),
  getLeadUseCase: new GetLeadUseCaseImpl(),
  getLeadListByAssigneeUseCase: new GetLeadListByAssigneeUseCaseIpml(),
  getLeadListByTenantUseCase: new GetLeadListByTenantUseCaseIpml(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  createLeadUseCase,
  updateLeadUseCase,
  getLeadUseCase,
  getLeadListByAssigneeUseCase,
  getLeadListByTenantUseCase,
} = useCases;
