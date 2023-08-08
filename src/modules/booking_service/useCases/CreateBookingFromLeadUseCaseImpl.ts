import { helper } from 'core';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingFromLeadInput } from '../models/rawApiData/CreateBookingFromLeadInput';
import {
  bookingRepository,
  customerRepository,
  leadRepository,
  tourTemplateRepository,
  userRepository,
} from '../repositories';
import { BOOKING_STATUS_INDEX, CUSTOMER_INDEX } from '../utils/constants';
import { CreateBookingFromLeadUseCase } from './interfaces/CreateBookingFromLeadUseCase';

export default class CreateBookingFromLeadUseCaseImpl implements CreateBookingFromLeadUseCase {
  /**
   * Create new booking from lead for customer
   * @param currentUserInfo User info including tenant id, username and full name
   * @param newBookingInput New booking input params
   */
  invoke = async (currentUserInfo: {
    tenant: string,
    username: string,
    name: any,
  }, newBookingInput: CreateBookingFromLeadInput) => {
    const now = Date.now();
    const { tenant, username: creatorUserName, name: creatorName } = currentUserInfo;

    // Get and extract data attributes from Lead
    const { leadId, assigneeId, services } = newBookingInput;
    const lead = await leadRepository.getById(tenant, leadId);
    if (!lead) { // Lead should not be empty
      throw new Error(`Lead with id ${leadId} of tenant ${tenant} not found.`);
    }
    const {
      email,
      phoneNumber,
      honorific,
      name,
      address,
      tourTemplateId,
      sourceId,
      sourceName,
    } = lead;

    // Verify tour template
    let tourTemplate;
    if (tourTemplateId) {
      tourTemplate = await tourTemplateRepository.get(tenant, tourTemplateId);
      if (!tourTemplate) {
        throw new Error(`Tour template with id ${tourTemplateId} of tenant ${tenant} not found.`);
      }
    }

    // Get and extract data attributes from User (Sale employee)
    const sale = await userRepository.get(tenant, assigneeId);
    if (!sale) { // Sale should not be empty
      throw new Error(`Sale with id ${assigneeId} of tenant ${tenant} not found.`);
    }
    const { firstName, lastName, username: saleUsername } = sale;
    const assigneeName = (firstName && lastName) ? `${firstName} ${lastName}` : saleUsername;

    // Prepare booking information for storing to database
    // such as: Tour template, tour type, departure date, assignee, source, note
    const { tourType, departureDate } = newBookingInput;
    const code = await bookingRepository.generateCode(tenant);
    const status: BookingStatus = 'INITIALIZED';
    // Prepare and save booking to database
    let newBooking: Booking = {
      code,
      tourLeadId: leadId,
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
      assigneeId,
      assigneeName,
      lsi3: `${BOOKING_STATUS_INDEX}#${status}`, // <status>,
    };

    const existingCustomer = await customerRepository.findOneByPhone(
      tenant,
      phoneNumber,
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
        customer: {
          email, primaryPhoneNumber: phoneNumber, honorific, name, address,
        },
      };
    }

    const createdBooking = await bookingRepository.create(tenant, newBooking);
    return helper.excludeDataFromObject(createdBooking) as Booking;
  };
}
