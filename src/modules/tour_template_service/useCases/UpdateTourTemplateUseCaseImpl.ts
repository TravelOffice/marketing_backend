import { TourTemplate } from '../models/TourTemplate';
import { tourTemplateRepository } from '../repositories';
import { UpdateTourTemplateUseCase } from './interfaces/UpdateTourTemplateUseCase';

export default class UpdateTourTemplateUseCaseImpl
  implements UpdateTourTemplateUseCase
{
  invoke = (
    tenantId: string,
    tourTemplateId: string,
    tourTemplate: TourTemplate
  ) => tourTemplateRepository.update(tenantId, tourTemplateId, tourTemplate);
}
