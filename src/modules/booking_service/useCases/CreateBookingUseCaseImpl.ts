import { helper } from 'core';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingInput } from '../models/rawApiData/CreateBookingInput';
import {
  bookingRepository, customerRepository, sourceRepository, tourTemplateRepository,
} from '../repositories';
import { BOOKING_STATUS_INDEX, CUSTOMER_INDEX } from '../utils/constants';
import { CreateBookingUseCase } from './interfaces/CreateBookingUseCase';

export default class CreateBookingUseCaseImpl implements CreateBookingUseCase {
  /**
   * Create new booking for customer
   * @param currentUserInfo User info including tenant id, username and full name
   * @param newBookingInput New booking input params
   */
  invoke = async (currentUserInfo: {
    tenant: string,
    username: string,
    name: any,
  }, newBookingInput: CreateBookingInput) => {
    const now = Date.now();
    const { tenant, username: creatorUserName, name: creatorName } = currentUserInfo;
    const {
      tourType, tourTemplateId, departureDate, sourceId, services, customer,
    } = newBookingInput;

    // Verify source
    const source = await sourceRepository.get(tenant, sourceId);
    if (!source) {
      throw new Error(`Source with id ${sourceId} of tenant ${tenant} not found`);
    }
    const sourceName = source.name;

    // Verify tour template
    const tourTemplate = await tourTemplateRepository.get(tenant, tourTemplateId);
    if (!tourTemplate) {
      throw new Error(`Tour template with id ${tourTemplateId} of tenant ${tenant} not found.`);
    }

    const code = await bookingRepository.generateCode(tenant);
    const status: BookingStatus = 'INITIALIZED';
    let newBooking: Booking = {
      code,
      tourType,
      createdAt: now,
      updatedAt: now,
      bookingStatus: status,
      paymentStatus: 'UNPAID',
      services,
      tourTemplateId,
      departureDate,
      sourceId,
      sourceName,
      creatorId: creatorUserName,
      creatorName,
      assigneeId: creatorUserName,
      assigneeName: creatorName,
      lsi3: `${BOOKING_STATUS_INDEX}#${status}`, // <status>
    };

    const existingCustomer = await customerRepository.findOneByPhone(
      tenant,
      customer.primaryPhoneNumber,
    );

    // Check if the customer already exists in database
    if (existingCustomer) {
      // If the customer exists, create a new booking with customerId
      newBooking = {
        ...newBooking,
        customerId: existingCustomer.code,
        lsi5: `${CUSTOMER_INDEX}#${existingCustomer.code}`, // <customer_code>
      };
    } else {
      // If the customer does not exist in database, create a new booking with customer information
      newBooking = {
        ...newBooking,
        customer: newBookingInput.customer,
      };
    }

    // Prepare and save booking to database
    const createdBooking = await bookingRepository.create(tenant, newBooking as Booking);
    return helper.excludeDataFromObject(createdBooking) as Booking;
  };
}
