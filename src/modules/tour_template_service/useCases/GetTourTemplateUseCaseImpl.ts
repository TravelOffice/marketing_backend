import { helper } from 'core';
import { tourTemplateRepository } from '../repositories';
import { GetTourTemplateUseCase } from './interfaces/GetTourTemplateUseCase';
import logger from '../utils/logger';
import { TourTemplate } from '../models/TourTemplate';

export default class GetTourTemplateUseCaseImpl
implements GetTourTemplateUseCase {
  invoke = async (
    tenantId: string,
    tourTemplateId: string,
  ) => {
    const tourTemplate = await tourTemplateRepository.get(tenantId, tourTemplateId);
    if (!tourTemplate) {
      logger.log(`Could not found Tour Template ${tourTemplateId} of tenant ${tenantId}`);
      throw new Error(`Could not found Tour Template ${tourTemplateId}`);
    }
    return helper.excludeDataFromObject(tourTemplate) as TourTemplate;
  };
}
