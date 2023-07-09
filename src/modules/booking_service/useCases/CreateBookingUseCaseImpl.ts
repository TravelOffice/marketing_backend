import { CustomerLevel, SourceType } from '../models/Customer';
import { Booking, BookingStatus } from '../models/booking/Booking';
import { CreateBookingInput } from '../models/rawApiData/CreateBookingInput';
import { bookingRepository, customerRepository, tourTemplateRepository } from '../repositories';
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
    let customer = await customerRepository.findOneByPhone(tenant, phone);
    const creatorId = username;
    const creatorName = name;
    if (!customer) {
      const assigneeId = username;
      const assigneeName = name;
      const code = await customerRepository.generateCode(tenant);
      customer = await customerRepository.create(tenant, {
        code,
        email,
        address,
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
    const { tourType, tourTemplateId, departureDate } = newBookingInput;

    // Verify tour template
    const tourTemplate = await tourTemplateRepository.get(tenant, tourTemplateId);
    if (!tourTemplate) {
      throw new Error(`Tour template with id ${tourTemplateId} of tenant ${tenant} not found.`);
    }

    // Prepare and save booking to database
    const customerInfo = { email, phone };
    const code = await bookingRepository.generateCode(tenant);
    const status: BookingStatus = 'INITIALIZED';
    const newBooking: Booking = {
      code,
      customerId,
      customerInfo,
      tourType,
      createdAt: now,
      updatedAt: now,
      bookingStatus: status,
      paymentStatus: 'UNPAID',
      services: [],
      tourTemplateId,
      departureDate,
      lsi3: `${BOOKING_STATUS_INDEX}#${status}`, // <status>,
      lsi5: `${CUSTOMER_INDEX}#${customerId}`, // <customer_code>
    };
    const createdBooking = await bookingRepository.create(tenant, newBooking);
    await customerRepository.updateLatestBooking(tenant, customerId, {
      id: code,
      creatorId,
      creatorName,
      createdAt: now,
    });
    return createdBooking;
  };
}
