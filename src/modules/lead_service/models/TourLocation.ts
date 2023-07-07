export enum TourLocationStatus {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE'
}

export interface TourLocation {
  name: string
  code: string,
  status: TourLocationStatus
}
