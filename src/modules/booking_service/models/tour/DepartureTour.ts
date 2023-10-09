import TourOperationStatus from './TourOperationstatus';
import { TourStatus } from './TourStatus';
import { TourTemplate } from './TourTemplate';

export interface DepartureTour extends TourTemplate {
  tourTemplate: string,
  tourTemplateCode: string,
  startDate: string,
  status: TourStatus,
  assigneeId: string,
  assigneeName: string,
  operationStatus: TourOperationStatus,
  operator?: string,
  fillingRatio: number, // The ratio of total confirmed pax to visitor count
  totalConfirmedPax: number, // Number of passenger who has its booking status is CONFIRMED
}

export const operationStatusTransitionRules = [
  `${TourOperationStatus.WAITING_FOR_OPERATION}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.PROCESSING}-${TourOperationStatus.TRANSFERRED}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.COMPLETED}`,
];
