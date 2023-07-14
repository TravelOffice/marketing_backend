import { TourTemplate } from '../models/TourTemplate';
import { tourTemplateRepository } from '../repositories';
import { CreateTourTemplateUseCase } from './interfaces/CreateTourTemplateUseCase';
import { CREATED_AT_INDEX, UPDATED_AT_INDEX } from '../utils/constants';

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
      lsi1: `${CREATED_AT_INDEX}#${now}`,
      lsi2: `${UPDATED_AT_INDEX}#${now}`,
    };
    return tourTemplateRepository.create(tenantId, tourTemplateToAdd);
  };
}
