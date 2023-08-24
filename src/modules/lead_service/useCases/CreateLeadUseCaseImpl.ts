import { helper } from 'core';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import { CreateLeadDto } from '../dto/CreateLeadDto';
import { Lead, LeadStatus } from '../models/Lead';
import { customerRepository, leadRepository } from '../repositories';
import { CognitoUser } from '../models/User';
import {
  ASSIGNEE_INDEX,
  CREATED_AT_INDEX,
  CUSTOMER_INDEX,
  LEAD_STATUS_INDEX,
  NONE_VALUE,
  UPDATED_AT_INDEX,
} from '../utils/constants';
import { Customer } from '../models/Customer';
import BaseRepositoryImpl from './BaseRepositoryImpl';

export default class CreateLeadUseCaseImpl extends BaseRepositoryImpl implements CreateLeadUseCase {
  /**
   * Method to create a new Lead, following steps:
   * - Create a new Customer from lead's contact
   * - Create a new Lead
   * - Logging and notification to stakeholders
   * @param currentUser current user who performs this action
   * @param createLeadDto data to create a new lead
   * @return Lead an instance of Lead after creating successfully
   */
  invoke = async (currentUser: CognitoUser, createLeadDto: CreateLeadDto) => {
    // Verify customer data,
    // new customer will be created if lead's phone number is not existed
    const { tenant } = currentUser;
    const customer = await customerRepository.findOneByPhone(tenant, createLeadDto.phoneNumber);
    // Create a new Lead
    const leadToAdd = await this.buildLeadToAdd({
      currentUser,
      createLeadDto,
      customer,
    });

    // TODO: Logging and notification

    const lead = await leadRepository.create(currentUser.tenant, leadToAdd);
    return helper.excludeDataFromObject(lead) as Lead;
  };

  private async buildLeadToAdd(data: {
    currentUser: CognitoUser,
    createLeadDto: CreateLeadDto,
    customer?: Customer,
  }) {
    const { currentUser, createLeadDto, customer } = data;
    const {
      assigneeId,
      tourTemplateId,
      sourceId,
      type,
      departure,
    } = createLeadDto;
    const { tenant, username, name } = currentUser;

    const now = Date.now();
    const status = assigneeId ? LeadStatus.PROCESSING : LeadStatus.NEW;
    const leadCode = await leadRepository.generateLeadCode(currentUser.tenant);
    const source = await this.getSource(tenant, sourceId);
    const assignee = await this.getAssignee(tenant, assigneeId);
    const tourTemplate = await this.getTourTemplate(tenant, tourTemplateId);
    const location = await this.getTourLocation(tenant, departure);

    const leadToAdd: Lead = {
      code: leadCode,
      lsi1: `${CREATED_AT_INDEX}#${now.toString()}`,
      lsi2: `${UPDATED_AT_INDEX}#${now.toString()}`,
      lsi3: `${LEAD_STATUS_INDEX}#${status}`,
      lsi4: `${ASSIGNEE_INDEX}#${assigneeId || NONE_VALUE}`,
      lsi5: customer ? `${CUSTOMER_INDEX}#${customer.code}` : `${CUSTOMER_INDEX}#`,
      ...createLeadDto,
      creatorId: username,
      creatorName: name,
      sourceId: source.code,
      sourceName: source.name,
      assigneeId: assignee?.username,
      assigneeName: assignee ? `${assignee.firstName} ${assignee.lastName}` : undefined,
      tourTemplateId: tourTemplate?.code,
      tourTemplateName: tourTemplate?.name,
      type: tourTemplate ? tourTemplate.type : type,
      departureName: location.name,
      leadStatus: status,
      tags: [],
      createdAt: now,
      updatedAt: now,
      customerId: customer ? customer.code : undefined,
    };

    return leadToAdd;
  }
}
