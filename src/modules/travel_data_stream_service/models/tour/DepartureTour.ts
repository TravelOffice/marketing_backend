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
  operator?:string,
  totalRevenue: number,
  totalCost: number,
  totalProfit: number,
  fillingRatio: number,
}

export const operationStatusTransitionRules = [
  `${TourOperationStatus.WAITING_FOR_OPERATION}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.PROCESSING}-${TourOperationStatus.TRANSFERRED}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.PROCESSING}`,
  `${TourOperationStatus.TRANSFERRED}-${TourOperationStatus.COMPLETED}`,
];
