import { helper } from 'core';
import {
  bookingRepository,
  customerRepository,
  databaseRepository,
  departureTourRepository,
  paymentVoucherRepository,
} from '../repositories';
import logger from '../utils/logger';
import { BOOKING_STATUS_INDEX } from '../utils/constants';
import { DepartureTour, operationStatusTransitionRules } from '../models/DepartureTour';
import { ChangeOperationStatusUseCase } from './interfaces/ChangeOperationStatusUseCase';
import TourOperationStatus from '../models/TourOperationstatus';
import { LatestBooking } from '../models/customer/Customer';
import { Booking } from '../models/booking/Booking';
import {
  calculateCostOfDepartureTour,
  calculateRevenueOfDepartureTour,
  sendEmailNotiTourStatusChanged,
} from '../utils/departureTourUtils';

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
  ): Promise<DepartureTour> => {
    // Retrieve the departure tour based on the tenantId and departureTourId
    const departureTour = await departureTourRepository.get(tenantId, departureTourId);
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
    let updatedDepartureTour = await departureTourRepository.changeOperationStatus(
      tenantId,
      departureTourId,
      toOperationStatus,
    );
    logger.log(`Operation status of departure tour ${departureTourId} changed to ${toOperationStatus} successfully.`);

    // Send email to notify assignee and operator manager
    if (departureTour.assigneeId) {
      await sendEmailNotiTourStatusChanged(
        tenantId,
        departureTour,
        departureTour.assigneeId,
        currentOperationStatus,
        toOperationStatus,
      );
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

      updatedDepartureTour = await this.updateRevenueAndProfitOfDepartureTour(
        tenantId,
        departureTourId,
        bookingsWithPayment,
      );

      // Update bookings and customers
      await this.updateBookingsWithPotentialCustomers(tenantId, bookingsWithPayment);
    }

    return helper.excludeDataFromObject(updatedDepartureTour) as DepartureTour;
  };

  private updateRevenueAndProfitOfDepartureTour = async (
    tenantId: string,
    departureTourId: string,
    bookingsWithPayment: Booking[],
  ): Promise<DepartureTour> => {
    // Calculate total revenue of departure tour
    // Total revenue = sum of total payment of bookings
    const totalRevenue = calculateRevenueOfDepartureTour(bookingsWithPayment);

    // Calculate total cost of departure tour from payment vouchers
    const paymentVouchersOfTour = await paymentVoucherRepository.listByTour(
      tenantId,
      departureTourId,
    );
    const totalCost = calculateCostOfDepartureTour(paymentVouchersOfTour);

    // Calculate total profit of departure tour
    // Total profit = total revenue - total cost
    const totalProfit = totalRevenue - totalCost;

    // Update total revenue and total profit of departure tour
    return departureTourRepository.update(
      tenantId,
      departureTourId,
      { totalRevenue, totalProfit, totalCost },
    );
  };

  private updateBookingsWithPotentialCustomers = async (
    tenantId: string,
    bookingsWithPayment: Booking[],
  ) => {
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
  };
}
