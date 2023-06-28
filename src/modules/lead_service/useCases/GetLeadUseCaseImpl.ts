import { helper } from 'core';
import { Lead } from '../models/Lead';
import { leadRepository } from '../repositories';
import logger from '../utils/logger';
import { GetLeadUseCase } from './interfaces/GetLeadUseCase';

export default class GetLeadUseCaseImpl implements GetLeadUseCase {
  /**
   * Method to get specific Lead by given id
   * @param tenantId id of the tenant
   * @param leadId id of the Lead to be get
   */
  invoke = async (tenantId: string, leadId: string) => {
    const lead = await leadRepository.getById(tenantId, leadId);
    if (!lead) {
      logger.log(`Could not found Lead ${leadId} of tenant ${tenantId}`);
      throw new Error(`Could not found Lead ${leadId}`);
    }
    return helper.excludeDataFromObject(lead) as Lead;
  };
}
