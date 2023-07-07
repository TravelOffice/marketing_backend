import { BaseDdbModel } from 'common-models';

export enum TourLocationStatus {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE'
}

export interface TourLocation extends BaseDdbModel {
  name: string
  code: string,
  status: TourLocationStatus,
  creator: string,
}
