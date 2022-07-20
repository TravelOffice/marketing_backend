/* eslint-disable no-shadow */

import { Note } from './Note';
import { Task } from './Task';
import { Tourist } from './Tourist';

export enum BookingStatusEnum {
  INITIALIZED = 'INITIALIZED',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  IN_PROCESS = 'IN_PROCESS',
  COMPLETED = 'COMPLETED',
}

export enum BookingPaymentStatusEnum {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
}

export type BookingStatus = keyof typeof BookingStatusEnum;
export type BookingPaymentStatus = keyof typeof BookingPaymentStatusEnum;

export interface Booking {
  title: string,
  createdAt: number,
  status: BookingStatus,
  paymentStatus: BookingPaymentStatus,
  startDate: number,
  endDate: number,
  updatedAt: number,
  tourists?: Tourist[],
  notes?: Note[],
  tasks?: Task[],
  creatorId: string,
  creatorName: string,
}

export const bookingStatuses = Object.keys(BookingStatusEnum) as Array<BookingStatus>;
