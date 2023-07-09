import { BaseDdbModel } from 'common-models';
import { Note } from './Note';
import { Task } from './Task';

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

export enum MaritalStatus {
  MARRIED = 'MARRIED',
  SINGLE = 'SINGLE',
  // Other: user can input custom value
}

export enum CustomerType {
  PERSONAL = 'PERSONAL',
  BUSSINESS = 'BUSSINESS'
}

export enum CustomerLevel {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  VVIP = 'VVIP'
}

export enum SourceType {
  SOCIAL = 'SOCIAL',
  WEBSITE = 'WEBSITE',
  ADVERTISEMENT = 'ADVERTISEMENT',
  EVENT = 'EVENT',
  OTHER = 'OTHER',

}

// Save latest booking information into customer record
export interface LatestBooking {
  id: string,
  creatorId: string,
  creatorName: string,
  createdAt: number,
}

interface DdbCustomerModel extends BaseDdbModel {
  code: string,
  name: string,
  honorific: HonorificType,
  birthday?: string,
  sex?: SexType,
  maritalStatus?: MaritalStatus,
  primaryPhoneNumber: string,
  otherPhoneNumbers?: Array<string>,
  email: string,
  address: string,
  tags?: Array<string>,
  source: SourceType,
  tasks?: Task[],
  notes?: Note[],
  creatorId?: string,
  creatorName?: string,
  assigneeId?: string,
  assigneeName?: string,
  interest?: string,
  group?: string,
  genitive?: string,
  taxCode?: string,
  level: CustomerLevel,
  socialLink?: string,
  revenue?: number,
  latestBooking?: LatestBooking,
}

export type Customer = Omit<DdbCustomerModel, 'pk' | 'sk'>;
