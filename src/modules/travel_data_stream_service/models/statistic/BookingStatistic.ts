import { BaseDdbModel } from 'common-models';

export interface BookingStatistic extends BaseDdbModel {
  // Tour template id
  // Used to analyze the most of tours that users are interested in
  ttId?: string,
  // Tour template name
  ttN?: string,
  // Total payment amount
  totalP?: number,
}
