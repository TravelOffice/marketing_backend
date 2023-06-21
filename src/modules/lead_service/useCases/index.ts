import CancelLeadUseCaseImpl from './CancelLeadUseCaseImpl';
import ChangeLeadStatusUseCaseImpl from './ChangeLeadStatusUseCaseImpl';
import { CancelLeadUseCase } from './interfaces/CancelLeadUseCase';
import { ChangeLeadStatusUseCase } from './interfaces/ChangeLeadStatusUseCase';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import CreateLeadUseCaseImpl from './CreateLeadUseCaseImpl';

interface UseCases {
  changeLeadStatusUseCase: ChangeLeadStatusUseCase,
  cancelLeadUseCase: CancelLeadUseCase,
  createLeadUseCase: CreateLeadUseCase,
}

const useCases: UseCases = {
  changeLeadStatusUseCase: new ChangeLeadStatusUseCaseImpl(),
  cancelLeadUseCase: new CancelLeadUseCaseImpl(),
  createLeadUseCase: new CreateLeadUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  changeLeadStatusUseCase,
  cancelLeadUseCase,
  createLeadUseCase,
} = useCases;
