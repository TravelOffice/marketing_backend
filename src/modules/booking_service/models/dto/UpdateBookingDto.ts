import { Booking } from '../booking/Booking';

export type UpdateBookingDto = Pick<Booking,
  'tourType' |
  'notes' |
  'tasks' |
  'paymentStatus' |
  'assigneeId' |
  'canceledReason' |
  'canceledAtPhase' |
  'services' |
  'tourTemplateId' |
  'departureDate' |
  'departureTourId' |
  'requestedCode' |
  'labelId' |
  'sourceId' |
  'requestStatus' |
  'baseTotal' |
  'baseTotalAfterVAT' |
  'totalBonusSale' |
  'promoCode' |
  'discountMoney' |
  'discountPercent' |
  'totalPayment' |
  'totalPaid' |
  'description' |
  'checkin' |
  'checkout' |
  'bookingAt' |
  'waitingAt' |
  'waitingExpiredAt' |
  'doneAt' |
  'totalPax' |
  'customer' |
  'passengers' |
  'paidAmount'
>
