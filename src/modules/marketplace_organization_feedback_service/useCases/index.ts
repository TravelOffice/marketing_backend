// TODO: Declare use cases which can be used in this service here

import CreateOrgFeedbackUseCaseImpl from './CreateOrgFeedbackUseCaseImpl';
import DeleteOrgFeedbackUseCaseImpl from './DeleteOrgFeedbackUseCaseImpl';
import GetOrgFeedbackListUseCaseImpl from './GetOrgFeedbackListUseCaseImpl';
import GetOrgFeedbackUseCaseImpl from './GetOrgFeedbackUseCaseImpl';
import UpdateOrgFeedbackUseCaseImpl from './UpdateOrgFeedbackUseCaseImpl';
import { CreateOrgFeedbackUseCase } from './interfaces/CreateOrgFeedbackUseCase';
import { DeleteOrgFeedbackUseCase } from './interfaces/DeleteOrgFeedbackUseCase';
import { GetOrgFeedbackListUseCase } from './interfaces/GetOrgFeedbackListUseCase';
import { GetOrgFeedbackUseCase } from './interfaces/GetOrgFeedbackUseCase';
import { UpdateOrgFeedbackUseCase } from './interfaces/UpdateOrgFeedbackUseCase';

interface UseCases {
  getOrgFeedbackListUseCase: GetOrgFeedbackListUseCase,
  createOrgFeedbackUseCase: CreateOrgFeedbackUseCase,
  getOrgFeedbackUseCase: GetOrgFeedbackUseCase,
  updateOrgFeedbackUseCase: UpdateOrgFeedbackUseCase,
  deleteOrgFeedbackUseCase: DeleteOrgFeedbackUseCase,
}

const useCases: UseCases = {
  getOrgFeedbackListUseCase: new GetOrgFeedbackListUseCaseImpl(),
  createOrgFeedbackUseCase: new CreateOrgFeedbackUseCaseImpl(),
  getOrgFeedbackUseCase: new GetOrgFeedbackUseCaseImpl(),
  updateOrgFeedbackUseCase: new UpdateOrgFeedbackUseCaseImpl(),
  deleteOrgFeedbackUseCase: new DeleteOrgFeedbackUseCaseImpl(),
};

export const {
  getOrgFeedbackListUseCase,
  createOrgFeedbackUseCase,
  getOrgFeedbackUseCase,
  updateOrgFeedbackUseCase,
  deleteOrgFeedbackUseCase,
} = useCases;
