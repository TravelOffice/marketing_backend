import { helper } from 'core';
import { CreateLeadUseCase } from './interfaces/CreateLeadUseCase';
import { CreateLeadDto } from '../dto/CreateLeadDto';
import { Lead, LeadStatus } from '../models/Lead';
import { customerRepository, leadRepository } from '../repositories';
import { User } from '../models/User';
import {
  ASSIGNEE_INDEX,
  CREATED_AT_INDEX,
  CREATOR_INDEX,
  CUSTOMER_INDEX,
  LEAD_STATUS_INDEX,
  NONE_VALUE,
  PHONE_INDEX,
  UPDATED_AT_INDEX,
} from '../utils/constants';
import { SourceType } from '../models/Customer';

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
      assigneeId,
    } = createLeadDto;

    // Verify customer data,
    // new customer will be created if lead's phone number is not existed
    const { tenant, username, name } = currentUser;
    let customer = await customerRepository.findOneByPhone(tenant, createLeadDto.phoneNumber);
    const now = Date.now();
    if (!customer) {
      const creatorId = username;
      const creatorName = name;
      const customerCode = await customerRepository.generateCode(tenant);
      customer = await customerRepository.create(tenant, {
        code: customerCode,
        email: createLeadDto.email,
        address: createLeadDto.address ?? '',
        honorific: createLeadDto.honorific,
        name: createLeadDto.name,
        primaryPhoneNumber: createLeadDto.phoneNumber,
        source: SourceType.OTHER,
        createdAt: now,
        updatedAt: now,
        creatorId,
        creatorName,
        lsi1: `${CREATED_AT_INDEX}#${now}`, // createdAt lsi
        lsi2: `${UPDATED_AT_INDEX}#${now}`, // updatedAt lsi
        lsi3: `${PHONE_INDEX}#${createLeadDto.phoneNumber}`, // primaryPhoneNumber lsi
        lsi4: `${CREATOR_INDEX}#${creatorId}`, // creatorId lsi
        lsi5: `${ASSIGNEE_INDEX}#${creatorId}`, // assignee lsi
      });
      await customerRepository.create(tenant, customer);
    }

    // Create a new Lead
    const status = assigneeId ? LeadStatus.PROCESSING : LeadStatus.NEW;
    const leadCode = await leadRepository.generateLeadCode(currentUser.tenant);
    const leadToAdd: Lead = {
      code: leadCode,
      creatorId: username,
      creatorName: name,
      lsi1: `${CREATED_AT_INDEX}#${now.toString()}`,
      lsi2: `${UPDATED_AT_INDEX}#${now.toString()}`,
      lsi3: `${LEAD_STATUS_INDEX}#${status}`,
      lsi4: `${ASSIGNEE_INDEX}#${assigneeId || NONE_VALUE}`,
      lsi5: `${CUSTOMER_INDEX}#${customer.code}}`,
      sourceName: '',
      leadStatus: status,
      tags: [],
      createdAt: now,
      updatedAt: now,
      customerId: customer.code,
      // type: '', // TODO: Fill lead type, depends on tour template
      ...createLeadDto,
    };

    // TODO: Logging and notification

    const lead = await leadRepository.create(currentUser.tenant, leadToAdd);
    return helper.excludeDataFromObject(lead) as Lead;
  };
}
