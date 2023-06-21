import { TourTemplate } from '../models/TourTemplate';
import { tourTemplateRepository } from '../repositories';
import { CreateTourTemplateUseCase } from './interfaces/CreateTourTemplateUseCase';

export default class CreateTourTemplateUseCaseImpl
  implements CreateTourTemplateUseCase
{
  invoke = async (tenantId: string, tourTemplate: TourTemplate) =>
    tourTemplateRepository.create(tenantId, tourTemplate);
}
