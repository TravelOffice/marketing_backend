import TourOperationStatus from './TourOperationstatus';
import { TourPlan } from './TourPlan';
import { TourStatus } from './TourStatus';
import { TourTemplate } from './TourTemplate';

export interface DepartureTour extends TourTemplate {
  tourTemplate: string,
  tourTemplateCode: string,
  startDate: number,
  status: TourStatus,
  assigneeId: string,
  assigneeName: string,
  operationStatus: TourOperationStatus,
  operator?: string,
  tourPlan?: TourPlan,
}

export const operationStatusTransitionRules = [
  `${TourOperationStatus.WAITING_FOR_OPERATION}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.PROCESSING}-${TourOperationStatus.TRANSFERRED}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.COMPLETED}`,
];
