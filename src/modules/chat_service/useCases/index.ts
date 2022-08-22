import AutoAssignChatUseCaseImpl from './AutoAssignChatUseCaseImpl';
import {
  AutoAssignChatUseCase,
  ManualAssignChatUseCase,
} from './interfaces';
import ManualAssignChatUseCaseImpl from './ManualAssignChatUseCaseImpl';

interface UseCases {
  manualAssignChatUseCase: ManualAssignChatUseCase,
  autoAssignChatUseCase: AutoAssignChatUseCase,
}

const useCases: UseCases = {
  manualAssignChatUseCase: new ManualAssignChatUseCaseImpl(),
  autoAssignChatUseCase: new AutoAssignChatUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  manualAssignChatUseCase,
  autoAssignChatUseCase,
} = useCases;
