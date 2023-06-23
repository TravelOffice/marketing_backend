import { TourTemplate } from '../models/TourTemplate';
import { tourTemplateRepository } from '../repositories';
import { CreateTourTemplateUseCase } from './interfaces/CreateTourTemplateUseCase';
import { TOUR_TEMPLATE_INDEX } from '../utils/constants';

export default class CreateTourTemplateUseCaseImpl
implements CreateTourTemplateUseCase {
  invoke = async (
    tenantId: string,
    tourTemplate: TourTemplate,
  ) => {
    const now = Date.now();
    const code = await tourTemplateRepository.generateTourTemplateCode(tenantId);
    const tourTemplateToAdd: TourTemplate = {
      ...tourTemplate,
      code,
      createdAt: now,
      updatedAt: now,
      lsi1: `${TOUR_TEMPLATE_INDEX}#${now}`,
    };
    return tourTemplateRepository.create(tenantId, tourTemplateToAdd);
  };
}
