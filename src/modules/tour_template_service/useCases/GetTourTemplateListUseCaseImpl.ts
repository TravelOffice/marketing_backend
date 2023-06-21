import { tourTemplateRepository } from "../repositories";
import { GetTourTemplateListUseCase } from "./interfaces/GetTourTemplateListUseCase";

export default class GetTourTemplateListUseCaseImpl
  implements GetTourTemplateListUseCase
{
  invoke = async (tenantId: string) => tourTemplateRepository.list(tenantId);
}
