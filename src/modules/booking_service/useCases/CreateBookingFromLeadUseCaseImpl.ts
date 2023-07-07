import { CustomerLevel, SourceType } from '../models/Customer';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingFromLeadInput } from '../models/rawApiData/CreateBookingFromLeadInput';
import {
  bookingRepository,
  customerRepository,
  leadRepository,
  tourTemplateRepository,
  userRepository,
} from '../repositories';
import {
  ASSIGNEE_INDEX,
  BOOKING_STATUS_INDEX,
  CREATED_AT_INDEX,
  CREATOR_INDEX,
  CUSTOMER_INDEX,
  PHONE_INDEX,
  UPDATED_AT_INDEX,
} from '../utils/constants';
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
    // Verify customer data,
    // new customer will be created if customer data sent from client is not existed
    const now = Date.now();
    const { tenant, username, name } = currentUserInfo;

    // Get and extract data attributes from Lead
    const { leadId, assigneeId } = newBookingInput;
    const lead = await leadRepository.getById(tenant, leadId);
    if (!lead) { // Lead should not be empty
      throw new Error(`Lead with id ${leadId} of tenant ${tenant} not found.`);
    }
    const {
      email, phoneNumber: phone, honorific, name: fullName, address, tourTemplateId,
    } = lead;

    // Verify tour template
    if (tourTemplateId) {
      const tourTemplate = await tourTemplateRepository.get(tenant, tourTemplateId);
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

    let customer = await customerRepository.findOneByPhone(tenant, phone);
    if (!customer) {
      const creatorId = username;
      const creatorName = name;
      const code = await customerRepository.generateCode(tenant);
      customer = await customerRepository.create(tenant, {
        code,
        email,
        address: address || '',
        honorific,
        name: fullName,
        primaryPhoneNumber: phone,
        source: SourceType.OTHER,
        level: CustomerLevel.STANDARD,
        createdAt: now,
        updatedAt: now,
        creatorId,
        creatorName,
        assigneeId,
        assigneeName,
        lsi1: `${CREATED_AT_INDEX}#${now}`, // createdAt lsi
        lsi2: `${UPDATED_AT_INDEX}#${now}`, // updatedAt lsi
        lsi3: `${PHONE_INDEX}#${phone}`, // primaryPhoneNumber lsi
        lsi4: `${CREATOR_INDEX}#${creatorId}`, // creatorId lsi
        lsi5: `${ASSIGNEE_INDEX}#${creatorId}`, // assignee lsi
      });
      await customerRepository.create(tenant, customer);
    }

    // Prepare booking information for storing to database
    // such as: Tour template, tour type, departure date, assignee, source, note
    const customerId = customer!.code;
    const { tourType, services, departureDate } = newBookingInput;
    const customerInfo = { email, phone };
    const code = await bookingRepository.generateCode(tenant);
    const status: BookingStatus = 'INITIALIZED';

    // Prepare and save booking to database
    const newBooking: Booking = {
      code,
      tourLeadId: leadId,
      customerId,
      customerInfo,
      tourType,
      createdAt: now,
      updatedAt: now,
      bookingStatus: status,
      paymentStatus: 'UNPAID',
      services,
      tourTemplateId,
      departureDate,
      lsi3: `${BOOKING_STATUS_INDEX}#${status}`, // <status>,
      lsi5: `${CUSTOMER_INDEX}#${customerId}`, // <customer_code>
    };
    return bookingRepository.create(tenant, newBooking);
  };
}
