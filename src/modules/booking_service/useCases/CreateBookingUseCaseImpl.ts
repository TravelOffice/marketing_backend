import { Customer, SourceType } from '../models/Customer';
import { Booking } from '../models/booking/Booking';
import { CreateBookingInput } from '../models/rawApiData/CreateBookingInput';
import { bookingRepository, customerRepository } from '../repositories';
import { PHONE_INDEX } from '../utils/constants';
import { CreateBookingUseCase } from './interfaces/CreateBookingUseCase';

export default class CreateBookingUseCaseImpl implements CreateBookingUseCase {
  /**
   * Create new booking for customer
   * @param newBooking Booking data sent from client
   */
  invoke = async (tenant: string, newBookingInput: CreateBookingInput) => {
    // Verify customer data,
    // new customer will be created if customer data sent from client is not existed
    const now = Date.now();
    const {
      email, phone, honorific, fullName, address,
    } = newBookingInput.customer;
    const customer = await customerRepository.findOneByPhone(tenant, phone);
    if (!customer) {
      const code = await customerRepository.generateCode(tenant);
      const newCustomer: Customer = {
        code,
        email,
        address,
        honorific,
        name: fullName,
        primaryPhoneNumber: phone,
        source: SourceType.OTHER,
        createdAt: now,
        updatedAt: now,
      };
      await customerRepository.create(tenant, newCustomer);
    }

    // Prepare booking information for storing to database
    // such as: Tour template, tour type, departure date, assignee, source, note
    const customerId = `${PHONE_INDEX}#${phone}`;
    const { tourType } = newBookingInput;
    const customerInfo = { email, phone };
    const code = await bookingRepository.generateCode(tenant);
    const newBooking: Booking = {
      code,
      customerId,
      customerInfo,
      tourType,
      createdAt: now,
      updatedAt: now,
      status: 'INITIALIZED',
      paymentStatus: 'UNPAID',
    };
    // Save booking to database
    return bookingRepository.create(tenant, newBooking);
  };
}
