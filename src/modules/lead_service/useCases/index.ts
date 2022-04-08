import CreateOrUpdateLeadUseCaseImpl from './CreateOrUpdateLeadUseCaseImpl';
import { CreateOrUpdateLeadUseCase } from './interfaces/CreateOrUpdateLeadUseCase';

interface UseCases {
  createOrUpdateLeadUseCase: CreateOrUpdateLeadUseCase,
}

const useCases : UseCases = {
  createOrUpdateLeadUseCase: new CreateOrUpdateLeadUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  createOrUpdateLeadUseCase,
} = useCases;
