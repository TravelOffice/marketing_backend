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
import { GetMyLeadListUseCase } from './interfaces/GetMyLeadListUseCase';
import GetMyLeadListUseCaseImpl from './GetMyLeadListUseCaseImpl';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';
import UpdateLeadUseCaseImpl from './UpdateLeadUseCaseImpl';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';
import GetLeadUseCaseImpl from './GetLeadUseCaseImpl';

interface UseCases {
  changeLeadStatusUseCase: ChangeLeadStatusUseCase,
  cancelLeadUseCase: CancelLeadUseCase,
  createLeadUseCase: CreateLeadUseCase,
  getLeadListUseCase: GetLeadListUseCase,
  getLeadUseCase: GetLeadUseCase,
  changeLeadAssigneeUseCase: ChangeLeadAssigneeUseCase,
  getMyLeadListUseCase: GetMyLeadListUseCase,
  updateLeadUseCase: UpdateLeadUseCase,
}

const useCases: UseCases = {
  changeLeadStatusUseCase: new ChangeLeadStatusUseCaseImpl(),
  cancelLeadUseCase: new CancelLeadUseCaseImpl(),
  createLeadUseCase: new CreateLeadUseCaseImpl(),
  getLeadListUseCase: new GetLeadListUseCaseImpl(),
  getLeadUseCase: new GetLeadUseCaseImpl(),
  changeLeadAssigneeUseCase: new ChangeLeadAssigneeUseCaseImpl(),
  getMyLeadListUseCase: new GetMyLeadListUseCaseImpl(),
  updateLeadUseCase: new UpdateLeadUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  changeLeadStatusUseCase,
  cancelLeadUseCase,
  createLeadUseCase,
  getLeadListUseCase,
  getLeadUseCase,
  changeLeadAssigneeUseCase,
  getMyLeadListUseCase,
  updateLeadUseCase,
} = useCases;
