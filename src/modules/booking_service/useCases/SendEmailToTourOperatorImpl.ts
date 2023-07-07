import { BookingStatusEnum } from '../models/booking/Booking';
import { SendEmailToTourOperatorUseCase } from './interfaces/SendEmailToTourOperatorUseCase';
import sendEmail from '../utils/email';
import { MailTemplate } from '../models/MailTemplate';
import { bookingRepository } from '../repositories';
import logger from '../utils/logger';

export default class SendEmailToTourOperatorImpl implements SendEmailToTourOperatorUseCase {
  /**
   * Invokes sending email to tour operator for a specific tenant and a specific booking
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} bookingId - The ID of the booking to cancel.
   * @param {string} fromAddress - Send from
   * @param {MailTemplate} mailTemplate - The mail template to send to tour operator
   * @returns
   * @throws {Error} - If the booking is not found or booking status is not completed
   */
  invoke = async (
    tenantId: string,
    bookingId: string,
    fromAddress: string,
    mailTemplate:MailTemplate,
  ) => {
    const booking = await bookingRepository.getByGivenId(tenantId, bookingId);

    // Booking should be existed in database
    if (!booking) {
      throw new Error(`Booking with id ${bookingId} not found for tenant ${tenantId}`);
    }

    // Only send email to tour operator when booking status is COMPLETED
    if (booking.bookingStatus !== BookingStatusEnum.COMPLETED) {
      throw new Error(`Current status of booking with id ${bookingId} is not COMPLETED for tenant ${tenantId}`);
    }
    await sendEmail(fromAddress, mailTemplate);
    logger.log(`An email has been sent to tour operator with template ${mailTemplate}`);
    return mailTemplate;
  };
}
