import { BaseDdbModel } from 'common-models';

export interface LeadStatistic extends BaseDdbModel {
  // pk = TN#<tenant>#L
  // sk = <lead_code>
  // lsi1 = <createdAt>
  // lsi2 = <saleId>#<createdAt>
  // lsi3 = sourceId // CHAT, EMAIL, PHONE, WEBSITE...
  // lsi4 = FROMCHAT#<createdAt>

  // Location id
  // Used to analyze the most of locations that users are interested in
  lcId?: string,
  // Location name
  lcN?: string,
}
