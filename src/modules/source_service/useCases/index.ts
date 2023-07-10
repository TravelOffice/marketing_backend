// TODO: Declare use cases which can be used in this service here

import CreateSourceUseCaseImpl from './CreateSourceUseCaseImpl';
import DeleteSourceUseCaseImpl from './DeleteSourceUseCaseImpl';
import GetSourceListUseCaseImpl from './GetSourceListUseCaseImpl';
import GetSourceUseCaseImpl from './GetSourceUseCaseImpl';
import { CreateSourceUseCase } from './interfaces/CreateSourceUseCase';
import { DeleteSourceUseCase } from './interfaces/DeleteSourceUseCase';
import { GetSourceListUseCase } from './interfaces/GetSourceListUseCase';
import { GetSourceUseCase } from './interfaces/GetSourceUseCase';
import { UpdateSourceUseCase } from './interfaces/UpdateSourceUseCase';
import UpdateSourceUseCaseImpl from './UpdateSourceUseCaseImpl';

interface UseCases {
  getSourceListUseCase: GetSourceListUseCase,
  createSourceUseCase: CreateSourceUseCase,
  getSourceUseCase: GetSourceUseCase,
  updateSourceUseCase: UpdateSourceUseCase,
  deleteSourceUseCase: DeleteSourceUseCase,
}

const useCases : UseCases = {
  getSourceListUseCase: new GetSourceListUseCaseImpl(),
  createSourceUseCase: new CreateSourceUseCaseImpl(),
  getSourceUseCase: new GetSourceUseCaseImpl(),
  updateSourceUseCase: new UpdateSourceUseCaseImpl(),
  deleteSourceUseCase: new DeleteSourceUseCaseImpl(),
};

export const {
  getSourceListUseCase,
  createSourceUseCase,
  getSourceUseCase,
  updateSourceUseCase,
  deleteSourceUseCase,
} = useCases;
