export enum SexType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}
export enum VocativeType {
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

export interface Lead {
  code: string,

  // Contact
  name: string,
  vocative: VocativeType,
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
  createdAt: number,
  updatedAt: number,

  // Indexes
  lsi1: string, // LEAD#STATUS#<status>
  lsi2: string, // LEAD#ASSIGNEE#<assignee>
  lsi3: string, // LEAD#SOURCE#<source>,
  lsi4: string, // LEAD#START#<start_date>,
  lsi5: string, // LEAD#TYPE#<type>
}

export const CHANGING_STATUS_RULES = [
  `${LeadStatus.NEW}-${LeadStatus.PROCESSING}`,
  `${LeadStatus.NEW}-${LeadStatus.CANCEL}`,
  `${LeadStatus.PROCESSING}-${LeadStatus.CLOSED}`,
  `${LeadStatus.PROCESSING}-${LeadStatus.CANCEL}`,
];
