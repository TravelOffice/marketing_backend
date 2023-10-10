import { BaseDdbModel } from 'common-models';

export interface LeadStatistic extends BaseDdbModel {
  // Location id
  // Used to analyze the most of locations that users are interested in
  lcId?: string,
  // Location name
  lcN?: string,
}
