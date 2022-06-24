// TODO: Declare use cases which can be used in this service here

import CreateQuoteUseCaseImpl from './CreateQuoteUseCaseImpl';
import DeleteQuoteUseCaseImpl from './DeleteQuoteUseCaseImpl';
import GetQuoteListByAssigneeUseCaseImpl from './GetLatestQuotesByAssigneeUseCaseImpl';
import GetQuoteUseCaseImpl from './GetQuoteUseCaseImpl';
import { CreateQuoteUseCase } from './interfaces/CreateQuoteUseCase';
import { DeleteQuoteUseCase } from './interfaces/DeleteQuoteUseCase';
import { GetQuoteListByAssigneeUseCase } from './interfaces/GetLatestQuotesByAssigneeUseCase';
import { GetQuoteUseCase } from './interfaces/GetQuoteUseCase';
import { UpdateQuoteUseCase } from './interfaces/UpdateQuoteUseCase';
import UpdateQuoteUseCaseImpl from './UpdateQuoteUseCaseImpl';

interface UseCases {
  getLatestQuotesByAssigneeUseCase: GetQuoteListByAssigneeUseCase,
  createQuoteUseCase: CreateQuoteUseCase,
  getQuoteUseCase: GetQuoteUseCase,
  updateQuoteUseCase: UpdateQuoteUseCase,
  deleteQuoteUseCase: DeleteQuoteUseCase,
}

const useCases : UseCases = {
  getLatestQuotesByAssigneeUseCase: new GetQuoteListByAssigneeUseCaseImpl(),
  createQuoteUseCase: new CreateQuoteUseCaseImpl(),
  getQuoteUseCase: new GetQuoteUseCaseImpl(),
  updateQuoteUseCase: new UpdateQuoteUseCaseImpl(),
  deleteQuoteUseCase: new DeleteQuoteUseCaseImpl(),
};

export const {
  getLatestQuotesByAssigneeUseCase,
  createQuoteUseCase,
  getQuoteUseCase,
  updateQuoteUseCase,
  deleteQuoteUseCase,
} = useCases;
