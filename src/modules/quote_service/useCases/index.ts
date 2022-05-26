// TODO: Declare use cases which can be used in this service here

import CreateQuoteUseCaseImpl from './CreateQuoteUseCaseImpl';
import DeleteQuoteUseCaseImpl from './DeleteQuoteUseCaseImpl';
import GetQuoteListUseCaseImpl from './GetQuoteListUseCaseImpl';
import GetQuoteUseCaseImpl from './GetQuoteUseCaseImpl';
import { CreateQuoteUseCase } from './interfaces/CreateQuoteUseCase';
import { DeleteQuoteUseCase } from './interfaces/DeleteQuoteUseCase';
import { GetQuoteListUseCase } from './interfaces/GetQuoteListUseCase';
import { GetQuoteUseCase } from './interfaces/GetQuoteUseCase';
import { UpdateQuoteUseCase } from './interfaces/UpdateQuoteUseCase';
import UpdateQuoteUseCaseImpl from './UpdateQuoteUseCaseImpl';

interface UseCases {
  getQuoteListUseCase: GetQuoteListUseCase,
  createQuoteUseCase: CreateQuoteUseCase,
  getQuoteUseCase: GetQuoteUseCase,
  updateQuoteUseCase: UpdateQuoteUseCase,
  deleteQuoteUseCase: DeleteQuoteUseCase,
}

const useCases : UseCases = {
  getQuoteListUseCase: new GetQuoteListUseCaseImpl(),
  createQuoteUseCase: new CreateQuoteUseCaseImpl(),
  getQuoteUseCase: new GetQuoteUseCaseImpl(),
  updateQuoteUseCase: new UpdateQuoteUseCaseImpl(),
  deleteQuoteUseCase: new DeleteQuoteUseCaseImpl(),
};

export const {
  getQuoteListUseCase,
  createQuoteUseCase,
  getQuoteUseCase,
  updateQuoteUseCase,
  deleteQuoteUseCase,
} = useCases;
