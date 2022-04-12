import CreateOrUpdateLeadUseCaseImpl from './CreateOrUpdateLeadUseCaseImpl';
import GetLeadUseCaseImpl from './GetLeadUseCaseImpl';
import { CreateOrUpdateLeadUseCase } from './interfaces/CreateOrUpdateLeadUseCase';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

interface UseCases {
  createOrUpdateLeadUseCase: CreateOrUpdateLeadUseCase,
  getLeadUseCase: GetLeadUseCase,
}

const useCases : UseCases = {
  createOrUpdateLeadUseCase: new CreateOrUpdateLeadUseCaseImpl(),
  getLeadUseCase: new GetLeadUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  createOrUpdateLeadUseCase,
  getLeadUseCase,
} = useCases;
