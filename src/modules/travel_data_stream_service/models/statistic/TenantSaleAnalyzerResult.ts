import { TourFillingRatioStatistic } from './TourFillingRatioStatistic';
import { BookingStatistic } from './BookingStatistic';
import { LeadStatistic } from './LeadStatistic';

export type MetricSaleAnalyzerResult =
  LeadStatistic
  | BookingStatistic
  | TourFillingRatioStatistic;

export type TenantSaleAnalyzerResult = MetricSaleAnalyzerResult[];
