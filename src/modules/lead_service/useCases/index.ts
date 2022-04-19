import CreateOrUpdateLeadUseCaseImpl from './CreateOrUpdateLeadUseCaseImpl';
import GetLeadListByAssigneeUseCaseIpml from './GetLeadListByFieldUseCaseImpl';
import GetLeadUseCaseImpl from './GetLeadUseCaseImpl';
import { CreateOrUpdateLeadUseCase } from './interfaces/CreateOrUpdateLeadUseCase';
import { GetLeadListByAssigneeUseCase } from './interfaces/GetLeadListByAssignee';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

interface UseCases {
  createOrUpdateLeadUseCase: CreateOrUpdateLeadUseCase,
  getLeadUseCase: GetLeadUseCase,
}

interface UseCases {
  createOrUpdateLeadUseCase: CreateOrUpdateLeadUseCase,
  getLeadListByAssigneeUseCase: GetLeadListByAssigneeUseCase,
}

const useCases : UseCases = {
  createOrUpdateLeadUseCase: new CreateOrUpdateLeadUseCaseImpl(),
  getLeadUseCase: new GetLeadUseCaseImpl(),
  getLeadListByAssigneeUseCase: new GetLeadListByAssigneeUseCaseIpml(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  createOrUpdateLeadUseCase,
  getLeadUseCase,
  getLeadListByAssigneeUseCase,
} = useCases;
