import { BaseDdbModel } from 'common-models';

export interface BookingStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#BK
  // sk = <booking_code>
  // lsi1 = <createdAt>
  // lsi2 = <saleId>#<createdAt>
  ttId: string, // tour template ID
  ttN: string, // tour template name
}

export interface TotalBookingMetricResponse {
  totalBooking: number,
}
