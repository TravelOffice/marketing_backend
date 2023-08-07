import { helper } from 'core';
import {
  bookingRepository, customerRepository, sourceRepository, userRepository,
} from '../repositories';
import { UpdateBookingCustomerUseCase } from './interfaces/UpdateBookingCustomerUseCase';
import { UpdateBookingCustomerDto } from '../models/dto/UpdateBookingCustomerDto';
import { Customer } from '../models/Customer';
import { ASSIGNEE_INDEX, UPDATED_AT_INDEX } from '../utils/constants';
import { updateBookingUseCase } from './index';

export default class UpdateBookingCustomerUseCaseImpl implements UpdateBookingCustomerUseCase {
  allowedUpdatingKeys: (keyof UpdateBookingCustomerDto)[] = [
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
   * @param bookingId id of the booking which related to customer
   * @param updateCustomerDto data to update
   */
  invoke = async (
    tenantId: string,
    bookingId: string,
    updateCustomerDto: UpdateBookingCustomerDto,
  ) => {
    const booking = await bookingRepository.getByGivenId(tenantId, bookingId);
    if (!booking) throw new Error(`Could not found Booking ${bookingId}`);

    // Extract allowed data from payload
    const allowedUpdatingData = helper.extractDataFromObject(
      updateCustomerDto,
      this.allowedUpdatingKeys,
    );

    // Initialize an empty object to store the updated customer data
    let updatedCustomer = {};

    // Check if the booking has customerId
    if (booking.customerId) {
      // If the booking has a customerId, retrieve the customer's information
      const { customerId } = booking;
      const customer = await customerRepository.get(tenantId, customerId);

      // If the customer is not found, throw an error
      if (!customer) throw new Error(`Could not found Customer ${customerId}`);

      // Retrieve the data to update from the customer based on allowed fields
      const dataToUpdate = await this.getDataToUpdate(tenantId, customer, allowedUpdatingData);

      // Update the customer's information and store the updated data
      updatedCustomer = await customerRepository.update(tenantId, customerId, dataToUpdate);
    } else {
      // Merge old customer data with new customer data
      updatedCustomer = {
        ...booking.customer,
        ...allowedUpdatingData,
      };

      // If the booking does not have a customerId,
      // invoke the updateBookingUseCase to update the booking with the updated customer data
      await updateBookingUseCase.invoke(
        tenantId,
        bookingId,
        { ...booking, customer: updatedCustomer }, // Update the booking's customer information
      );
    }

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
    updateCustomerDto: Partial<UpdateBookingCustomerDto>,
  ) {
    let dataToUpdate: Partial<Customer> = {};

    const props = Object.keys(updateCustomerDto);

    const { assigneeId, sourceId } = updateCustomerDto;

    const now = Date.now();

    props.forEach((key) => {
      const prop = key as keyof UpdateBookingCustomerDto;
      if (customer[prop] !== updateCustomerDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateCustomerDto[prop] };
      }
    });

    dataToUpdate.updatedAt = now;
    dataToUpdate.lsi2 = `${UPDATED_AT_INDEX}#${now}`;

    // Handle if changing assignee
    if (assigneeId) {
      const assignee = await userRepository.get(tenantId, assigneeId);
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
