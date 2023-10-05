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

export interface Passenger {
  name: string,
  honorific?: HonorificType,
  email?: string,
  phoneNumber?: string,
  address?: string,
  birthday?: number,
  sex?: SexType,
  attachedDoc?: string[],
}
