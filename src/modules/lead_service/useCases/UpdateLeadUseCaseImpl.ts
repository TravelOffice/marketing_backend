import { helper } from 'core';
import { leadRepository, userRepository } from '../repositories';
import { UpdateLeadUseCase } from './interfaces/UpdateLeadUseCase';
import { UpdateLeadDto } from '../dto/UpdateLeadDto';
import { Lead, LeadStatus } from '../models/Lead';
import {
  ASSIGNEE_INDEX, STATUS_INDEX, UPDATED_INDEX,
} from '../utils/constants';

export default class UpdateLeadUseCaseImpl implements UpdateLeadUseCase {
  allowedUpdatingKeys: (keyof UpdateLeadDto)[] = [
    'email',
    'name',
    'phoneNumber',
    'address',
    'honorific',
    'tourTemplateId',
    'desiredTour',
    'description',
    'assigneeId',
    'sourceId',
    'numberOfAdultPassengers',
    'numberOfChildrenPassengers',
    'departure',
    'startDate',
    'type',
    'tourType',
  ];

  /**
   * Method to update a Lead, following steps:
   * - Update customer information
   * - Update lead information
   * - Push notification to stakeholders
   * @param tenantId id of tenant
   * @param leadId id of the lead which should be updated
   * @param updateLeadDto data to update
   */
  invoke = async (tenantId: string, leadId: string, updateLeadDto: UpdateLeadDto) => {
    // TODO: Update customer information

    // TODO: Update lead information
    const lead = await leadRepository.getById(tenantId, leadId);
    if (!lead) throw new Error(`Could not found lead ${leadId}`);
    const allowedUpdatingData = helper.extractDataFromObject(
      updateLeadDto,
      this.allowedUpdatingKeys,
    );
    const dataToUpdate = await this.getDataToUpdate(tenantId, lead, allowedUpdatingData);

    const updatedLead = await leadRepository.update(tenantId, leadId, dataToUpdate);
    return helper.excludeDataFromObject(updatedLead) as Lead;
  };

  /**
   * Parse dto to data which should be used to update. This method is useful to optimize
   * the amount of data to update.
   * @param lead original lead object before updating
   * @param updateLeadDto data to update
   * @private
   */
  private async getDataToUpdate(
    tenantId: string,
    lead: Lead,
    updateLeadDto: Partial<UpdateLeadDto>,
  ) {
    let dataToUpdate: Partial<Lead> = {};

    const props = Object.keys(updateLeadDto);

    const { assigneeId } = updateLeadDto;

    const now = Date.now();

    props.forEach((key) => {
      const prop = key as keyof UpdateLeadDto;
      if (lead[prop] !== updateLeadDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateLeadDto[prop] };
      }
    });

    dataToUpdate.updatedAt = now;
    dataToUpdate.lsi2 = `${UPDATED_INDEX}#${now}`;

    // Handle if changing assignee
    if (assigneeId) {
      const assignee = await userRepository.getUserAttributes(tenantId, assigneeId);
      if (!assignee) {
        throw new Error(`Could not found assignee with id ${assignee}`);
      }
      dataToUpdate.assigneeName = `${assignee.lastName} ${assignee.firstName}`;
      dataToUpdate.lsi3 = `${STATUS_INDEX}#${LeadStatus.PROCESSING}`;
      dataToUpdate.lsi4 = `${ASSIGNEE_INDEX}#${assigneeId}`;
    }

    // TODO: Fill other fields

    return dataToUpdate;
  }
}
