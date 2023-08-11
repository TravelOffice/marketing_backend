/* eslint-disable no-shadow */

import { BaseDdbModel } from 'common-models';
import { Note } from '../Note';
import { Task } from '../Task';
import { Service } from './Service';
import { Lead } from '../Lead';
import { TourTemplate } from '../tour/TourTemplate';
import { Customer } from '../Customer';

export enum BookingStatusEnum {
  INITIALIZED = 'INITIALIZED',
  CONFIRMED = 'CONFIRMED',
  IN_PROCESS = 'IN_PROCESS', // When booking has assignee, the status change to IN_PROCESS
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED', // When departure tour completed, the status of related bookings change to COMPLETED
}

export enum BookingPaymentStatusEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export enum BookingTourTypeEnum {
  SOLO = 'SOLO',
  SHARED = 'SHARED',
  GROUP = 'GROUP',
}

export type BookingStatus = keyof typeof BookingStatusEnum;
export type BookingPaymentStatus = keyof typeof BookingPaymentStatusEnum;
export type BookingTourType = keyof typeof BookingTourTypeEnum;

interface DdbBookingModel extends BaseDdbModel {
  code: string, // Format BK+<number>
  tourLeadId?: string, // Sk value of Lead item
  customerId?: string, // Sk value of Customer item
  tourType: BookingTourType,
  deletedAt?: number,
  deletedBy?: string,
  notes?: Note[],
  tasks?: Task[],
  bookingStatus: BookingStatus,
  paymentStatus: BookingPaymentStatus,
  assigneeId?: string,
  assigneeName?: string,
  canceledAt?: number,
  canceledReason?: string,
  canceledBy?: string,
  canceledAtPhase?: BookingStatus,
  services: Service[],
  tourTemplateId?: string,
  departureDate?: string,
  departureTourId?: string,
  departureTourName?: string,

  /**
   * Booking related items
   * Such as Lead, Customer, TourTemplate
   */
  lead?: Lead,
  customer?: Partial<Customer>,
  tourTemplate?: TourTemplate,

  /**
   * TODO: Temporary attributes
   * These attrs will be updated later
   */
  requestedCode?: string,
  labelId?: string,
  sourceId?: string,
  sourceName?: string,
  creatorId?: string,
  creatorName?: string,
  requestStatus?: string,
  baseTotal?: number,
  baseTotalAfterVAT?: number,
  totalBonusSale?: number,
  promoCode?: string,
  discountMoney?: number,
  discountPercent?: number,
  totalPayment?: number,
  // role
  totalPaid?: number,
  description?: string,
  checkin?: number, // DateTime
  checkout?: number, // DateTime
  bookingAt?: number, // DateTime
  waitingAt?: number, // Time for waiting payment
  waitingExpiredAt?: string, // The time resavation expired
  doneAt?: string,
  // success // executiveNote // guideRecashMoney // commission
  totalPax?: number, // Total travellers
  // keepBonus // taxId // isBusiness // executiveStatus
  // executiveAt // roomHoldNumber // vatStatus // vatFee
  /** End temporary section */
}

export type Booking = Omit<DdbBookingModel, 'pk' | 'sk'>;

export const bookingStatuses = Object.keys(BookingStatusEnum) as Array<BookingStatus>;
// eslint-disable-next-line max-len
export const bookingPaymentStatuses = Object.keys(BookingPaymentStatusEnum) as Array<BookingPaymentStatusEnum>;
export const tourTypes = Object.keys(BookingTourTypeEnum) as Array<BookingTourType>;
export const statusTransitionRules = [
  `${BookingStatusEnum.INITIALIZED}-${BookingStatusEnum.IN_PROCESS}`,
  `${BookingStatusEnum.IN_PROCESS}-${BookingStatusEnum.PAYMENT_PENDING}`,
  `${BookingStatusEnum.IN_PROCESS}-${BookingStatusEnum.CONFIRMED}`,
  `${BookingStatusEnum.IN_PROCESS}-${BookingStatusEnum.CANCELED}`,
  `${BookingStatusEnum.PAYMENT_PENDING}-${BookingStatusEnum.CANCELED}`,
  `${BookingStatusEnum.PAYMENT_PENDING}-${BookingStatusEnum.CONFIRMED}`,
  `${BookingStatusEnum.CONFIRMED}-${BookingStatusEnum.CANCELED}`,
  `${BookingStatusEnum.CONFIRMED}-${BookingStatusEnum.COMPLETED}`,
  `${BookingStatusEnum.CANCELED}-${BookingStatusEnum.INITIALIZED}`,
];
