export enum SexType {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
};
export enum VocativeType {
  MR_YOUNG = 'MR_YOUNG',
  MRS_YOUNG = 'MRS_YOUNG',
  MR_OLD = 'MR_OLD',
  MRS_OLD = 'MRS_OLD',
};
export enum StatusType {
  NEW = 'NEW',
  QUALIFYING = 'QUALIFYING',
  QUALIFIED = 'QUALIFIED',
  TAKING_CARE = 'TAKING_CARE',
  TRADING = 'TRADING',
  TRADED = 'TRADED',
}
export enum MaritalStatus {
  MARRIED = 'MARRIED',
  SINGLE = 'SINGLE',
  // Other: user can input custom value
}
export enum LeadType {
  LEAD = 'LEAD',
  CUSTOMER = 'CUSTOMER',
}
export enum SourceType {
  SOCIAL = 'SOCIAL',
  WEBSITE = 'WEBSITE',
  ADVERTISEMENT = 'ADVERTISEMENT',
  EVENT = 'EVENT',
  OTHER = 'OTHER'
}

export interface Lead {
  name: string,
  vocative: VocativeType,
  birthday: string,
  nationality: string,
  sex: SexType,
  maritalStatus: MaritalStatus,
  primaryPhoneNumber: string,
  otherPhoneNumbers: Array<string>,
  email: string,
  country: string,
  province: string,
  district: string,
  ward: string,
  address: string,
  status: StatusType,
  createAt: string,
  updateAt: string,
  tags: Array<string>,
  createrId: string,
  createrName: string,
  assigneeId: string,
  assigneeName: string,
  source: SourceType,
  enabled: boolean,
  type: LeadType,
}
