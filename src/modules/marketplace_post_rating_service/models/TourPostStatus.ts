// eslint-disable-next-line no-shadow
export enum TourPostStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
  DELETED = 'DELETED' // Soft delete only
}

export const tourPostStatuses = Object.keys(TourPostStatus);

export const statusTransitionRules = [
  `${TourPostStatus.DRAFT}-${TourPostStatus.IN_PROGRESS}`,
  `${TourPostStatus.DRAFT}-${TourPostStatus.CLOSED}`,
  `${TourPostStatus.DRAFT}-${TourPostStatus.DELETED}`,
  `${TourPostStatus.IN_PROGRESS}-${TourPostStatus.EXPIRED}`,
  `${TourPostStatus.IN_PROGRESS}-${TourPostStatus.CLOSED}`,
];
