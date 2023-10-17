// TODO: Declare use cases which can be used in this service here

import CreateSessionUseCaseImpl from './CreateSessionUseCaseImpl';
import GetListOfSessionByConversationIdImpl from './GetListOfSessionByConversationIdImpl';
import { CreateSessionUseCase } from './interfaces/CreateSessionUseCase';
import { GetListOfSessionByConversationIdUseCase } from './interfaces/GetListOfSessionByConversationIdUseCase';
import { UpdateSessionUseCase } from './interfaces/UpdateSessionUseCase';
import UpdateSessionUseCaseImpl from './UpdateSessionUseCaseImpl';
import { GetSessionUseCase } from './interfaces/GetSessionUseCase';
import GetSessionUseCaseImpl from './GetSessionUseCaseImpl';
import { ActivateSessionUseCase } from './interfaces/ActivateSessionUseCase';
import ActivateSessionUseCaseImpl from './ActivateSessionUseCaseImpl';
import { CloseSessionUseCase } from './interfaces/CloseSessionUseCase';
import CloseSessionUseCaseImpl from './CloseSessionUseCaseImpl';

interface UseCases {
  getListOfSessionByConversationId: GetListOfSessionByConversationIdUseCase,
  getSessionUseCase: GetSessionUseCase,
  createSessionUseCase: CreateSessionUseCase,
  updateSessionUseCase: UpdateSessionUseCase,
  activateSessionUseCase: ActivateSessionUseCase,
  closeSessionUseCase: CloseSessionUseCase,
}

const useCases: UseCases = {
  getListOfSessionByConversationId: new GetListOfSessionByConversationIdImpl(),
  getSessionUseCase: new GetSessionUseCaseImpl(),
  createSessionUseCase: new CreateSessionUseCaseImpl(),
  updateSessionUseCase: new UpdateSessionUseCaseImpl(),
  activateSessionUseCase: new ActivateSessionUseCaseImpl(),
  closeSessionUseCase: new CloseSessionUseCaseImpl(),
};

export const {
  getListOfSessionByConversationId,
  getSessionUseCase,
  createSessionUseCase,
  updateSessionUseCase,
  activateSessionUseCase,
  closeSessionUseCase,
} = useCases;
