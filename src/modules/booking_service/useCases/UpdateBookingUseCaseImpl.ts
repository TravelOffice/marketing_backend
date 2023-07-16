import { helper } from 'core';
import logger from '../utils/logger';
import { Booking, BookingStatusEnum } from '../models/booking/Booking';
import {
  bookingRepository, customerRepository, sourceRepository, userRepository,
} from '../repositories';
import { UpdateBookingUseCase } from './interfaces/UpdateBookingUseCase';
import { UpdateBookingDto } from '../models/dto/UpdateBookingDto';

export default class UpdateBookingUseCaseImpl implements UpdateBookingUseCase {
  allowedUpdatingKeys: (keyof UpdateBookingDto)[] = [
    'tourType',
    'notes',
    'tasks',
    'paymentStatus',
    'assigneeId',
    'canceledReason',
    'canceledNote',
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

    logger.log(`Start updating booking data for tenant ${tenant} bookingId ${bookingId}`);
    const updatedBooking = await bookingRepository.update(tenant, bookingId, dataToUpdate);

    // TODO: move this to Completing booking
    // Check if the booking status is "COMPLETED" and update customer revenue
    if (updatedBooking.bookingStatus === BookingStatusEnum.COMPLETED) {
      // Update the customer's revenue using customerRepository.updateRevenue
      await customerRepository.updateRevenue(
        tenant,
        updatedBooking.customerId,
        updatedBooking.totalPayment!,
      );
      // Log a success message indicating the customer's revenue has been updated
      logger.log(`Update customer ${updatedBooking.customerId} revenue successfully`);
    }

    return helper.excludeDataFromObject(updatedBooking) as Booking;
  };

  /**
   * Parse dto to data which should be used to update. This method is useful to optimize
   * the amount of data to update.
   * @param customer original customer object before updating
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
