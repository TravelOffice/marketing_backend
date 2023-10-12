import { BaseDdbModel } from 'common-models';

export enum SexType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export enum HonorificType {
  MR_YOUNG = 'MR_YOUNG',
  MRS_YOUNG = 'MRS_YOUNG',
  MR_OLD = 'MR_OLD',
  MRS_OLD = 'MRS_OLD',
}
export enum LeadStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  CLOSED = 'CLOSED',
  CANCEL = 'CANCEL',
}

export interface Lead extends BaseDdbModel {
  code: string,

  // Contact
  name: string,
  honorific: HonorificType,
  email: string,
  phoneNumber: string,
  address?: string,
  customerId?: string,

  // Desire
  tourTemplateId?: string,
  tourTemplateName?: string,
  desiredTour?: string,
  tourType?: string,
  type: string,
  departure: string,
  departureName: string,
  startDate: string,
  description?: string,
  numberOfAdultPassengers: number,
  numberOfChildrenPassengers: number,

  // Manage
  leadStatus: LeadStatus,
  tags: Array<string>,
  creatorId: string,
  creatorName: string,
  assigneeId?: string,
  assigneeName?: string,
  sourceId: string,
  sourceName: string,
  cancelledReason?: string,

  endingLocationName: string,
  endingLocationCode: string,

  // Indexes
  // lsi1: string, // <createdAt>
  // lsi2: string, // <updatedAt>
  // lsi3: string, // <status>,
  // lsi4: string, // <assignee>,
  // lsi5: string, // <start_date>
}

export const CHANGING_STATUS_RULES = [
  `${LeadStatus.NEW}-${LeadStatus.PROCESSING}`,
  `${LeadStatus.NEW}-${LeadStatus.CANCEL}`,
  `${LeadStatus.PROCESSING}-${LeadStatus.CLOSED}`,
  `${LeadStatus.PROCESSING}-${LeadStatus.CANCEL}`,
];
