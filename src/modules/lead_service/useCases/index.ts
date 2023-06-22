import CancelLeadUseCaseImpl from './CancelLeadUseCaseImpl';
import ChangeLeadStatusUseCaseImpl from './ChangeLeadStatusUseCaseImpl';
import { CancelLeadUseCase } from './interfaces/CancelLeadUseCase';
import { ChangeLeadStatusUseCase } from './interfaces/ChangeLeadStatusUseCase';

interface UseCases {
  changeLeadStatusUseCase: ChangeLeadStatusUseCase,
  cancelLeadUseCase: CancelLeadUseCase,
}

const useCases : UseCases = {
  changeLeadStatusUseCase: new ChangeLeadStatusUseCaseImpl(),
  cancelLeadUseCase: new CancelLeadUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  changeLeadStatusUseCase,
  cancelLeadUseCase,
} = useCases;
