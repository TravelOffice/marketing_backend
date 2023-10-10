import { MetricName, SingleMetricInputData } from '../../models/statistic/analyzer';
import AbstractMetricAnalyzer from './AbstractMetricAnalyzer';
import BookingMetricsAnalyzer from './BookingMetricAnalyzer';
import DepartureTourMetricAnalyzer from './DepartureTourMetricAnalyzer';
import LeadMetricAnalyzer from './LeadMetricAnalyzer';
import TourFillingRatioMetricAnalyzer from './TourFillingRatioMetricAnalyzer';

export default class MetricAnalyzerBuilder {
  static build(
    metricName: MetricName,
    tenant: string,
    data: SingleMetricInputData,
  ): AbstractMetricAnalyzer {
    switch (metricName) {
      case 'BOOKING_METRIC':
        return new BookingMetricsAnalyzer(metricName, tenant, data);

      case 'LEAD_METRIC':
        return new LeadMetricAnalyzer(metricName, tenant, data);

      case 'TOUR_METRIC':
        return new DepartureTourMetricAnalyzer(metricName, tenant, data);

      case 'TOUR_FILLINGRATIO_METRIC':
        return new TourFillingRatioMetricAnalyzer(metricName, tenant, data);

      default:
        throw new Error(`Unknown metric name: ${metricName}`);
    }
  }
}
