export enum TourPostStatus {
  IN_PROCESS = 'IN_PROCESS',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
}

export const tourPostStatuses = Object.keys(TourPostStatus);

export const statusTransitionRules = [
  `${TourPostStatus.IN_PROCESS}-${TourPostStatus.EXPIRED}`,
  `${TourPostStatus.IN_PROCESS}-${TourPostStatus.CLOSED}`,
];
