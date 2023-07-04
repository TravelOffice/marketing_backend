// TODO: Declare use cases which can be used in this service here

import CreateReceiptUseCaseImpl from './CreateReceiptUseCaseImpl';
import DeleteReceiptUseCaseImpl from './DeleteReceiptUseCaseImpl';
import GetReceiptListUseCaseImpl from './GetReceiptListUseCaseImpl';
import GetReceiptUseCaseImpl from './GetReceiptUseCaseImpl';
import UpdateReceiptUseCaseImpl from './UpdateReceiptUseCaseImpl';
import { CreateReceiptUseCase } from './interfaces/CreateReceiptUseCase';
import { DeleteReceiptUseCase } from './interfaces/DeleteReceiptUseCase';
import { GetReceiptListUseCase } from './interfaces/GetReceiptListUseCase';
import { GetReceiptUseCase } from './interfaces/GetReceiptUseCase';
import { UpdateReceiptUseCase } from './interfaces/UpdateReceiptUseCase';

interface UseCases {
  createReceiptUseCase: CreateReceiptUseCase,
  deleteReceiptUseCase: DeleteReceiptUseCase,
  getReceiptListUseCase: GetReceiptListUseCase,
  getReceiptUseCase: GetReceiptUseCase,
  updateReceiptUseCase: UpdateReceiptUseCase,
}

const useCases: UseCases = {
  createReceiptUseCase: new CreateReceiptUseCaseImpl(),
  deleteReceiptUseCase: new DeleteReceiptUseCaseImpl(),
  getReceiptListUseCase: new GetReceiptListUseCaseImpl(),
  getReceiptUseCase: new GetReceiptUseCaseImpl(),
  updateReceiptUseCase: new UpdateReceiptUseCaseImpl(),
};

export const {
  createReceiptUseCase,
  deleteReceiptUseCase,
  getReceiptListUseCase,
  getReceiptUseCase,
  updateReceiptUseCase,
} = useCases;
