// TODO: Declare use cases which can be used in this service here

import CreateSessionUseCaseImpl from './CreateSessionUseCaseImpl';
import GetListOfSessionByConversationIdImpl from './GetListOfSessionByConversationIdImpl';
import { CreateSessionUseCase } from './interfaces/CreateSessionUseCase';
import { GetListOfSessionByConversationIdUseCase } from './interfaces/GetListOfSessionByConversationIdUseCase';
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
  activateSessionUseCase: ActivateSessionUseCase,
  closeSessionUseCase: CloseSessionUseCase,
}

const useCases: UseCases = {
  getListOfSessionByConversationId: new GetListOfSessionByConversationIdImpl(),
  getSessionUseCase: new GetSessionUseCaseImpl(),
  createSessionUseCase: new CreateSessionUseCaseImpl(),
  activateSessionUseCase: new ActivateSessionUseCaseImpl(),
  closeSessionUseCase: new CloseSessionUseCaseImpl(),
};

export const {
  getListOfSessionByConversationId,
  getSessionUseCase,
  createSessionUseCase,
  activateSessionUseCase,
  closeSessionUseCase,
} = useCases;
