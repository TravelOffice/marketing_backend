import { getEnv } from 'get-env';
import { helper } from 'core';
import {
  bookingRepository,
  customerRepository,
  databaseRepository,
  departureTourRepository,
  userRepository,
} from '../repositories';
import logger from '../utils/logger';
import sendEmail from '../utils/email';
import { BOOKING_STATUS_INDEX, OPERATOR_MANAGER_ROLE } from '../utils/constants';
import { MailTemplate } from '../models/MailTemplate';
import { DepartureTour, operationStatusTransitionRules } from '../models/DepartureTour';
import { ChangeOperationStatusUseCase } from './interfaces/ChangeOperationStatusUseCase';
import TourOperationStatus from '../models/TourOperationstatus';
import { LatestBooking } from '../models/customer/Customer';
import { Booking } from '../models/booking/Booking';

export default class ChangeOperationStatusUseCaseImpl implements ChangeOperationStatusUseCase {
  /**
   * Changes the operation status of a departure tour.
   *
   * @param {string} tenantId - The ID of the tenant.
   * @param {string} departureTourId - The ID of the departure tour.
   * @param {TourOperationStatus} toOperationStatus - The operation status to change to.
   * @returns {Promise<DepartureTour>} - A promise that resolves to the updated departure tour.
   */
  invoke = async (
    tenantId: string,
    departureTourId: string,
    toOperationStatus: TourOperationStatus,
  ) => {
    // Retrieve the departure tour based on the tenantId and ID
    const departureTour = await departureTourRepository.get(tenantId, departureTourId);

    // Validate departure tour information
    if (!departureTour) {
      throw new Error(`Departure tour ${departureTourId} does not exist!`);
    }

    // Return the departure tour as it is
    // if the departure tour is already in the given operation status
    const currentOperationStatus = departureTour.operationStatus;

    if (currentOperationStatus === toOperationStatus) {
      return helper.excludeDataFromObject(departureTour) as DepartureTour;
    }
    // Verify status transition
    const transition = `${currentOperationStatus}-${toOperationStatus}`;
    if (!operationStatusTransitionRules.includes(transition)) {
      throw new Error(`Invalid status transition: ${transition}`);
    }
    logger.log('Departure tour information validated successfully.');

    // Change the operation of the departure tour
    const updatedDepartureTour = await departureTourRepository.changeOperationStatus(
      tenantId,
      departureTourId,
      toOperationStatus,
    );

    logger.log(`Operation status of d tour ${departureTourId} changed to ${toOperationStatus} successfully.`);

    // Notify the change to the operator manager
    const operatorManagers = await userRepository.listByRole(tenantId, OPERATOR_MANAGER_ROLE);

    // Retrieve the user attributes based on the tenantId and assigneeId
    if (departureTour.assigneeId) {
      const assignee = await userRepository.getUserAttributes(tenantId, departureTour.assigneeId);
      const departureTourUrl = `${tenantId}.${getEnv('DEPARTURE_TOUR_URL')}/${departureTourId}`;
      if (!assignee) {
        throw new Error(`User ${departureTour.assigneeId} does not exist!`);
      }

      // Send mail to Operator manager
      // TODO: In the future, tenants can configure the mail template
      const mail: MailTemplate = {
        toAddresses: [assignee.email],
        ccAddresses: operatorManagers.map((item) => item.email),
        subject: `Operate departure tour [${departureTourId}]`,
        text: `The departure tour [${departureTourId}] has been transited to new state`, // For non-html client
        html: `<p>The operational status of departure tour [${departureTourId}] has been changed from ${currentOperationStatus} to ${toOperationStatus}</p><a href="${departureTourUrl}">Details</a>`, // For html client
      };
      await sendEmail(getEnv('NO_REPLY_DEFAULT_EMAIL'), mail);
    }

    if (toOperationStatus === TourOperationStatus.COMPLETED) {
      // Get all bookings of the departure tour
      const bookings = await bookingRepository.getListByDepartureTourId(
        tenantId,
        departureTour.code,
      );

      // Update booking with total payment and change status to COMPLETED
      const bookingsWithPayment = bookings.map((booking) => {
        const totalPayment = bookingRepository.calculateRevenue(booking);
        return {
          ...booking,
          totalPayment,
          bookingStatus: 'COMPLETED',
          lsi3: `${BOOKING_STATUS_INDEX}#COMPLETED`, // <status>,
        } as Booking;
      });

      const bookingsWithCustomer = bookingsWithPayment.filter(
        (booking) => booking.customerId,
      );

      // Filter and process bookings with new customers
      let bookingsWithPotentialCustomer = bookingsWithPayment.filter(
        (item) => !item.customerId,
      );

      // Determine the quantity of new customers
      const quantityCustomer = bookingsWithPotentialCustomer.length;
      // Generate codes for new customers
      let currentCode = await customerRepository.generateCustomerCode(
        tenantId,
        quantityCustomer,
      );

      // Update bookings and customers with generated codes
      bookingsWithPotentialCustomer = bookingsWithPotentialCustomer.map((booking: Booking) => {
        const code = currentCode.toString();
        currentCode -= 1;
        const latestBooking: LatestBooking = {
          id: booking.code,
          creatorId: booking.creatorId!,
          creatorName: booking.creatorName!,
          createdAt: booking.createdAt!,
        };
        return {
          ...booking,
          customerId: code,
          customer: {
            ...booking.customer,
            code,
            latestBooking,
            creatorId: booking.creatorId,
            creatorName: booking.creatorName,
          },
        } as Booking;
      });

      // Extract new customers and updating bookings
      const newCustomers = bookingsWithPotentialCustomer.map((booking) => booking.customer!);
      const updatingBookings = bookingsWithPotentialCustomer.map((booking) => {
        const { customer, ...rest } = booking;
        return rest;
      }).concat(bookingsWithCustomer);

      // Build batch write requests for customer and booking updates
      const customersPutRequest = customerRepository.buildBatchWriteCustomers(
        tenantId,
        newCustomers,
      );
      const bookingsPutRequest = bookingRepository.buildBatchWriteBookings(
        tenantId,
        updatingBookings,
      );

      // Logging: Notify the start of the customer and booking updates
      logger.log('Updating new customers and associated bookings.');

      // Execute the batch write requests to update customers and bookings
      await databaseRepository.executeBatchWrite(customersPutRequest.concat(bookingsPutRequest));

      // Logging: Notify the successful completion of customer and booking updates
      logger.log('New customers and associated bookings updated successfully.');
    }

    return helper.excludeDataFromObject(updatedDepartureTour) as DepartureTour;
  };
}
