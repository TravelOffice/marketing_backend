import { tourTemplateRepository } from "../repositories";
import { GetTourTemplateUseCase } from "./interfaces/GetTourTemplateUseCase";

export default class GetTourTemplateUseCaseImpl
  implements GetTourTemplateUseCase
{
  invoke = (tenantId: string, tourTemplateId: string) =>
    tourTemplateRepository.get(tenantId, tourTemplateId);
}
