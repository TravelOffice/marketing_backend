import { helper } from 'core';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import { CreateLeadDto } from '../dto/CreateLeadDto';
import { Lead, LeadStatus } from '../models/Lead';
import { leadRepository } from '../repositories';
import { User } from '../models/User';
import { NONE_VALUE } from '../utils/constants';

export default class CreateLeadUseCaseImpl implements CreateLeadUseCase {
  /**
   * Method to create a new Lead, following steps:
   * - Create a new Customer from lead's contact
   * - Create a new Lead
   * - Logging and notification to stakeholders
   * @param currentUser current user who performs this action
   * @param createLeadDto data to create a new lead
   * @return Lead an instance of Lead after creating successfully
   */
  invoke = async (currentUser: User, createLeadDto: CreateLeadDto) => {
    // Extract data from dto
    const {
      assigneeId, startDate,
    } = createLeadDto;

    // TODO: Create a new Customer

    // Create a new Lead
    const now = Date.now();
    const status = assigneeId ? LeadStatus.PROCESSING : LeadStatus.NEW;
    const code = await leadRepository.generateLeadCode(currentUser.tenant);
    const leadToAdd: Lead = {
      code,
      creatorId: currentUser.username,
      creatorName: currentUser.name,
      lsi1: now.toString(),
      lsi2: now.toString(),
      lsi3: status,
      lsi4: assigneeId || NONE_VALUE,
      lsi5: startDate,
      sourceName: '',
      leadStatus: status,
      tags: [],
      createdAt: now,
      updatedAt: now,
      // customerId: '', // TODO: Fill customer id after creating a new one
      // type: '', // TODO: Fill lead type, depends on tour template
      ...createLeadDto,
    };

    // TODO: Logging and notification

    const lead = await leadRepository.create(currentUser.tenant, leadToAdd);
    return helper.excludeDataFromObject(lead) as Lead;
  };
}
