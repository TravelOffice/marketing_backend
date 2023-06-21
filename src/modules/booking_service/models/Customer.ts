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

export enum SourceType {
    SOCIAL = 'SOCIAL',
    WEBSITE = 'WEBSITE',
    ADVERTISEMENT = 'ADVERTISEMENT',
    EVENT = 'EVENT',
    OTHER = 'OTHER',
}

interface DdbCustomerModel extends BaseDdbModel {
    code: string,
    name: string,
    honorific: HonorificType,
    birthday?: string,
    nationality?: string,
    sex?: SexType,
    maritalStatus?: MaritalStatus,
    primaryPhoneNumber: string,
    otherPhoneNumbers?: Array<string>,
    email: string,
    country?: string,
    province?: string,
    district?: string,
    ward?: string,
    address: string,
    tags?: Array<string>,
    source: SourceType,
    tasks?: Task[],
    notes?: Note[],
    creatorId?: string,
    creatorName?: string,
}

export type Customer = Omit<DdbCustomerModel, 'pk' | 'sk'>;
