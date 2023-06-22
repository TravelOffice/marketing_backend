import CancelLeadUseCaseImpl from './CancelLeadUseCaseImpl';
import ChangeLeadStatusUseCaseImpl from './ChangeLeadStatusUseCaseImpl';
import { CancelLeadUseCase } from './interfaces/CancelLeadUseCase';
import { ChangeLeadStatusUseCase } from './interfaces/ChangeLeadStatusUseCase';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import CreateLeadUseCaseImpl from './CreateLeadUseCaseImpl';
import { GetLeadListUseCase } from './interfaces/GetLeadListUseCase';
import GetLeadListUseCaseImpl from './GetLeadListUseCaseImpl';
import { ChangeLeadAssigneeUseCase } from './interfaces/ChangeLeadAssigneeUseCase';
import ChangeLeadAssigneeUseCaseImpl from './ChangeLeadAssigneeUseCaseImpl';

interface UseCases {
  changeLeadStatusUseCase: ChangeLeadStatusUseCase,
  cancelLeadUseCase: CancelLeadUseCase,
  createLeadUseCase: CreateLeadUseCase,
  getLeadListUseCase: GetLeadListUseCase,
  changeLeadAssigneeUseCase: ChangeLeadAssigneeUseCase,
}

const useCases: UseCases = {
  changeLeadStatusUseCase: new ChangeLeadStatusUseCaseImpl(),
  cancelLeadUseCase: new CancelLeadUseCaseImpl(),
  createLeadUseCase: new CreateLeadUseCaseImpl(),
  getLeadListUseCase: new GetLeadListUseCaseImpl(),
  changeLeadAssigneeUseCase: new ChangeLeadAssigneeUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  changeLeadStatusUseCase,
  cancelLeadUseCase,
  createLeadUseCase,
  getLeadListUseCase,
  changeLeadAssigneeUseCase,
} = useCases;
