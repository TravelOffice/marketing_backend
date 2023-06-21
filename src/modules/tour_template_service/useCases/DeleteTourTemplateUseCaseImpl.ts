import { tourTemplateRepository } from '../repositories';
import { DeleteTourTemplateUseCase } from './interfaces/DeleteTourTemplateUseCase';

export default class DeleteTourTemplateUseCaseImpl
  implements DeleteTourTemplateUseCase
{
  invoke = async (tenantId: string, tourTemplateId: string) =>
    tourTemplateRepository.delete(tenantId, tourTemplateId);
}
