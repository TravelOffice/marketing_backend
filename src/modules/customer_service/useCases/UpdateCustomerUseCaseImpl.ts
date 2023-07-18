import { helper } from 'core';
import { customerRepository, sourceRepository, userRepository } from '../repositories';
import { ASSIGNEE_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import { UpdateCustomerUseCase } from './interfaces/UpdateCustomerUseCase';
import { UpdateCustomerDto } from '../dto/UpdateCustomerDto';
import { Customer } from '../models/Customer';

export default class UpdateCustomerUseCaseImpl implements UpdateCustomerUseCase {
  allowedUpdatingKeys: (keyof UpdateCustomerDto)[] = [
    'name',
    'honorific',
    'sex',
    'maritalStatus',
    'primaryPhoneNumber',
    'otherPhoneNumbers',
    'email',
    'address',
    'tags',
    'assigneeId',
    'interest',
    'group',
    'genitive',
    'taxCode',
    'level',
    'socialLink',
    'sourceId',
  ];

  /**
   * Method to update a Customer, following steps:
   * - Update customer information
   * - Push notification to stakeholders
   * @param tenantId id of tenant
   * @param customerId id of the customer which should be updated
   * @param updateCustomerDto data to update
   */
  invoke = async (tenantId: string, customerId: string, updateCustomerDto: UpdateCustomerDto) => {
    // Update customer information
    const customer = await customerRepository.get(tenantId, customerId);
    if (!customer) throw new Error(`Could not found Customer ${customerId}`);
    const allowedUpdatingData = helper.extractDataFromObject(
      updateCustomerDto,
      this.allowedUpdatingKeys,
    );
    const dataToUpdate = await this.getDataToUpdate(tenantId, customer, allowedUpdatingData);

    const updatedCustomer = await customerRepository.update(tenantId, customerId, dataToUpdate);
    return helper.excludeDataFromObject(updatedCustomer) as Customer;
  };

  /**
   * Parse dto to data which should be used to update. This method is useful to optimize
   * the amount of data to update.
   * @param customer original customer object before updating
   * @param updateCustomerDto data to update
   * @private
   */
  private async getDataToUpdate(
    tenantId: string,
    customer: Customer,
    updateCustomerDto: Partial<UpdateCustomerDto>,
  ) {
    let dataToUpdate: Partial<Customer> = {};

    const props = Object.keys(updateCustomerDto);

    const { assigneeId, sourceId } = updateCustomerDto;

    const now = Date.now();

    props.forEach((key) => {
      const prop = key as keyof UpdateCustomerDto;
      if (customer[prop] !== updateCustomerDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateCustomerDto[prop] };
      }
    });

    dataToUpdate.updatedAt = now;
    dataToUpdate.lsi2 = `${UPDATED_AT_INDEX}#${now}`;

    // Handle if changing assignee
    if (assigneeId) {
      const assignee = await userRepository.getUserAttributes(tenantId, assigneeId);
      if (!assignee) {
        throw new Error(`Could not found assignee with id ${assignee}`);
      }
      dataToUpdate.assigneeName = `${assignee.lastName} ${assignee.firstName}`;
      dataToUpdate.lsi4 = `${ASSIGNEE_INDEX}#${assigneeId}`;
    }

    // Fill source
    if (sourceId) {
      const source = await sourceRepository.get(tenantId, sourceId);
      if (!source) throw new Error(`Could not found source with id ${sourceId}`);
      dataToUpdate.sourceName = source.name;
    }
    // TODO: Fill other fields

    return dataToUpdate;
  }
}
