import { CustomerLevel } from '../models/Customer';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingFromLeadInput } from '../models/rawApiData/CreateBookingFromLeadInput';
import { TourServicePrice } from '../models/tour/TourServicePrice';
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
      email,
      phoneNumber: phone,
      honorific,
      name: fullName,
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

    let customer = await customerRepository.findOneByPhone(tenant, phone);
    const creatorId = username;
    const creatorName = name;

    // Prepare booking information for storing to database
    // such as: Tour template, tour type, departure date, assignee, source, note
    const { tourType, departureDate } = newBookingInput;
    const code = await bookingRepository.generateCode(tenant);
    const status: BookingStatus = 'INITIALIZED';
    const services = tourTemplate?.services?.map((service: TourServicePrice) => ({
      serviceName: service.name,
      price: service.price,
      quantity: 1,
      tax: 0,
    })) ?? [];
    // Prepare and save booking to database
    const newBooking: Booking = {
      code,
      tourLeadId: leadId,
      customerId: customer ? customer.code : '',
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
      creatorId,
      creatorName,
      assigneeId,
      assigneeName,
      lsi3: `${BOOKING_STATUS_INDEX}#${status}`, // <status>,
      lsi5: customer ? `${CUSTOMER_INDEX}#${customer.code}` : '', // <customer_code>
    };
    const createdBooking = await bookingRepository.create(tenant, newBooking);
    if (customer) {
      await customerRepository.updateLatestBooking(tenant, customer.code, {
        id: code,
        creatorId,
        creatorName,
        createdAt: now,
      });
    }
    return createdBooking;
  };
}
