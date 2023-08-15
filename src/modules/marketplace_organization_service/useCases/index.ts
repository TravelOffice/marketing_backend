import CreateOrganizationUseCaseImpl from './CreateOrganizationUseCaseImpl';
import DeleteOrganizationUseCaseImpl from './DeleteOrganizationUseCaseImpl';
import GetOrganizationListUseCaseImpl from './GetOrganizationListUseCaseImpl';
import GetOrganizationUseCaseImpl from './GetOrganizationUseCaseImpl';
import { CreateOrganizationUseCase } from './interfaces/CreateOrganizationUseCase';
import { DeleteOrganizationUseCase } from './interfaces/DeleteOrganizationUseCase';
import { GetOrganizationListUseCase } from './interfaces/GetOrganizationListUseCase';
import { GetOrganizationUseCase } from './interfaces/GetOrganizationUseCase';
import { UpdateOrganizationUseCase } from './interfaces/UpdateOrganizationUseCase';
import UpdateOrganizationUseCaseImpl from './UpdateOrganizationUseCaseImpl';

interface UseCases {
  getOrganizationListUseCase: GetOrganizationListUseCase,
  createOrganizationUseCase: CreateOrganizationUseCase,
  getOrganizationUseCase: GetOrganizationUseCase,
  updateOrganizationUseCase: UpdateOrganizationUseCase,
  deleteOrganizationUseCase: DeleteOrganizationUseCase,
}

const useCases : UseCases = {
  getOrganizationListUseCase: new GetOrganizationListUseCaseImpl(),
  createOrganizationUseCase: new CreateOrganizationUseCaseImpl(),
  getOrganizationUseCase: new GetOrganizationUseCaseImpl(),
  updateOrganizationUseCase: new UpdateOrganizationUseCaseImpl(),
  deleteOrganizationUseCase: new DeleteOrganizationUseCaseImpl(),
};

export const {
  getOrganizationListUseCase,
  createOrganizationUseCase,
  getOrganizationUseCase,
  updateOrganizationUseCase,
  deleteOrganizationUseCase,
} = useCases;
