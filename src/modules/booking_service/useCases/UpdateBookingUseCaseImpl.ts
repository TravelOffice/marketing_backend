import { helper } from 'core';
import logger from '../utils/logger';
import { Booking, BookingStatusEnum } from '../models/booking/Booking';
import {
  bookingRepository, departureTourRepository, sourceRepository, userRepository,
} from '../repositories';
import { UpdateBookingUseCase } from './interfaces/UpdateBookingUseCase';
import { UpdateBookingDto } from '../models/dto/UpdateBookingDto';
import { DEPARTURE_TOUR_INDEX } from '../utils/constants';

export default class UpdateBookingUseCaseImpl implements UpdateBookingUseCase {
  allowedUpdatingKeys: (keyof UpdateBookingDto)[] = [
    'tourType',
    'notes',
    'tasks',
    'paymentStatus',
    'assigneeId',
    'canceledReason',
    'canceledAtPhase',
    'services',
    'tourTemplateId',
    'departureDate',
    'departureTourId',
    'requestedCode',
    'labelId',
    'sourceId',
    'requestStatus',
    'baseTotal',
    'baseTotalAfterVAT',
    'totalBonusSale',
    'promoCode',
    'discountMoney',
    'discountPercent',
    'totalPayment',
    'totalPaid',
    'description',
    'checkin',
    'checkout',
    'bookingAt',
    'waitingAt',
    'waitingExpiredAt',
    'doneAt',
    'totalPax',
    'customer',
  ];

  invoke = async (
    tenant: string,
    bookingId: string,
    updateBookingDto: UpdateBookingDto,
  ) => {
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (!booking) throw new Error(`Could not found Booking ${bookingId}`);
    const allowedUpdatingData = helper.extractDataFromObject(
      updateBookingDto,
      this.allowedUpdatingKeys,
    );
    const dataToUpdate = await this.getDataToUpdate(tenant, booking, allowedUpdatingData);

    let totalPayment = 0;
    // Calculate booking total payment when completed booking
    if (dataToUpdate.bookingStatus === BookingStatusEnum.COMPLETED) {
      dataToUpdate.services?.forEach((service) => {
        const payment = (service.price * service.quantity) * (100 + service.tax);
        totalPayment += payment / 100;
      });
    }

    logger.log(`Start updating booking data for tenant ${tenant} bookingId ${bookingId}`);
    const updatedBooking = await bookingRepository.update(tenant, bookingId, {
      ...dataToUpdate,
      totalPayment,
    });

    return helper.excludeDataFromObject(updatedBooking) as Booking;
  };

  /**
   * Parse dto to data which should be used to update. This method is useful to optimize
   * the amount of data to update.
   * @param tenantId Tenant id
   * @param booking original booking object before updating
   * @param updateBookingDto data to update
   * @private
   */
  private async getDataToUpdate(
    tenantId: string,
    booking: Booking,
    updateBookingDto: Partial<UpdateBookingDto>,
  ) {
    let dataToUpdate: Partial<Booking> = {};

    const props = Object.keys(updateBookingDto);

    const { assigneeId, sourceId } = updateBookingDto;

    const now = Date.now();

    props.forEach((key) => {
      const prop = key as keyof UpdateBookingDto;
      if (booking[prop] !== updateBookingDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateBookingDto[prop] };
      }
    });

    const { departureTourId } = dataToUpdate;
    if (departureTourId) {
      const departureTour = await departureTourRepository.getDepartureTour(
        tenantId,
        departureTourId,
      );
      if (!departureTour) throw new Error(`Departure tour [${departureTourId}] not found`);
      dataToUpdate = {
        ...dataToUpdate,
        departureTourId,
        departureTourName: departureTour.name,
        departureDate: departureTour.startDate,
        lsi4: `${DEPARTURE_TOUR_INDEX}#${departureTourId}`,
      };
    }

    dataToUpdate.updatedAt = now;

    // Handle if changing assignee
    if (assigneeId) {
      const assignee = await userRepository.get(tenantId, assigneeId);
      if (!assignee) {
        throw new Error(`Could not found assignee with id ${assignee}`);
      }
      dataToUpdate.assigneeName = `${assignee.lastName} ${assignee.firstName}`;
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
