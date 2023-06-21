// TODO: Declare use cases which can be used in this service here

import CreateTourTemplateUseCaseImpl from "./CreateTourTemplateUseCaseImpl";
import DeleteTourTemplateUseCaseImpl from "./DeleteTourTemplateUseCaseImpl";
import GetTourTemplateListUseCaseImpl from "./GetTourTemplateListUseCaseImpl";
import GetTourTemplateUseCaseImpl from "./GetTourTemplateUseCaseImpl";
import { CreateTourTemplateUseCase } from "./interfaces/CreateTourTemplateUseCase";
import { DeleteTourTemplateUseCase } from "./interfaces/DeleteTourTemplateUseCase";
import { GetTourTemplateListUseCase } from "./interfaces/GetTourTemplateListUseCase";
import { GetTourTemplateUseCase } from "./interfaces/GetTourTemplateUseCase";
import { UpdateTourTemplateUseCase } from "./interfaces/UpdateTourTemplateUseCase";
import UpdateTourTemplateUseCaseImpl from "./UpdateTourTemplateUseCaseImpl";

interface UseCases {
  getTourTemplateListUseCase: GetTourTemplateListUseCase;
  createTourTemplateUseCase: CreateTourTemplateUseCase;
  getTourTemplateUseCase: GetTourTemplateUseCase;
  updateTourTemplateUseCase: UpdateTourTemplateUseCase;
  deleteTourTemplateUseCase: DeleteTourTemplateUseCase;
}

const useCases: UseCases = {
  getTourTemplateListUseCase: new GetTourTemplateListUseCaseImpl(),
  createTourTemplateUseCase: new CreateTourTemplateUseCaseImpl(),
  getTourTemplateUseCase: new GetTourTemplateUseCaseImpl(),
  updateTourTemplateUseCase: new UpdateTourTemplateUseCaseImpl(),
  deleteTourTemplateUseCase: new DeleteTourTemplateUseCaseImpl(),
};

export const {
  getTourTemplateListUseCase,
  createTourTemplateUseCase,
  getTourTemplateUseCase,
  updateTourTemplateUseCase,
  deleteTourTemplateUseCase,
} = useCases;
