import { ManualAssignChatUseCase } from './interfaces/ManualAssignChatUseCase';
import ManualAssignChatUseCaseImpl from './ManualAssignChatUseCaseImpl';

interface UseCases {
  manualAssignChatUseCase: ManualAssignChatUseCase,
}

const useCases: UseCases = {
  manualAssignChatUseCase: new ManualAssignChatUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  manualAssignChatUseCase,
} = useCases;
