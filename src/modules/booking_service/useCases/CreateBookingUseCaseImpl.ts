import { CustomerLevel } from '../models/Customer';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingInput } from '../models/rawApiData/CreateBookingInput';
import { TourServicePrice } from '../models/tour/TourServicePrice';
import {
  bookingRepository, customerRepository, sourceRepository, tourTemplateRepository,
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
    // Verify customer data,
    // new customer will be created if customer data sent from client is not existed
    const now = Date.now();
    const { tenant, username, name } = currentUserInfo;
    const {
      email, phone, honorific, fullName, address,
    } = newBookingInput.customer;

    const {
      tourType, tourTemplateId, departureDate, sourceId,
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

    let customer = await customerRepository.findOneByPhone(tenant, phone);
    const creatorId = username;
    const creatorName = name;
    const assigneeId = username;
    const assigneeName = name;

    // Prepare and save booking to database
    const code = await bookingRepository.generateCode(tenant);
    const services = tourTemplate.services?.map((service: TourServicePrice) => ({
      serviceName: service.name,
      price: service.price,
      quantity: 1,
      tax: 0,
    })) ?? [];
    const status: BookingStatus = 'INITIALIZED';
    const newBooking: Booking = {
      code,
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
