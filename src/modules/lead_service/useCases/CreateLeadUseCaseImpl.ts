import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import { CreateLeadDto } from '../dto/CreateLeadDto';
import { Lead, LeadStatus } from '../models/Lead';
import { leadRepository } from '../repositories';
import { User } from '../models/User';
import {
  ASSIGNEE_INDEX,
  LEAD_INDEX,
  NONE_VALUE,
  SOURCE_INDEX,
  START_DATE_INDEX,
  STATUS_INDEX,
  TYPE_INDEX,
} from '../utils/constants';

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
      assigneeId, sourceId, startDate, type,
    } = createLeadDto;

    // TODO: Create a new Customer

    // Create a new Lead
    const now = Date.now();
    const status = assigneeId ? LeadStatus.PROCESSING : LeadStatus.NEW;
    const code = await leadRepository.generateLeadCode(currentUser.tenant);
    const leadToAdd: Lead = {
      code: `L${code}`,
      creatorId: currentUser.username,
      creatorName: currentUser.name,
      lsi1: `${LEAD_INDEX}#${STATUS_INDEX}#${status}`,
      lsi2: `${LEAD_INDEX}#${ASSIGNEE_INDEX}#${assigneeId || NONE_VALUE}`,
      lsi3: `${LEAD_INDEX}#${SOURCE_INDEX}#${sourceId}`,
      lsi4: `${LEAD_INDEX}#${START_DATE_INDEX}#${new Date(startDate).getTime()}`,
      lsi5: `${LEAD_INDEX}#${TYPE_INDEX}#${type}`,
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

    return leadRepository.create(currentUser.tenant, leadToAdd);
  };
}
