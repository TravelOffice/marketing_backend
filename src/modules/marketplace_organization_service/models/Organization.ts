import { BaseDdbModel } from 'common-models';

export interface Organization extends BaseDdbModel {
  name: string,
  code: string,
  email: string,
  phoneNumber: string,
  profilePicture?: string,
  address?: string,
  employeesCount?: number,
  foundedYear?: number,
  website?: string,
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    zalo?: string;
    instagram?: string;
  };
  creatorId: string,
  creatorName: string,
  createdAt: number,
  updatedAt: number,
}
