import { DailyKey } from './TourPlan';

export enum TourTrackingActivityStatusEnum {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export interface TourTrackingActivity {
    status: TourTrackingActivityStatusEnum;
    note: string;
}

export interface TourTracking {
    [key: DailyKey]: TourTrackingActivity[]
}

export const tourTrackingActivityStatusTypes = Object.keys(
  TourTrackingActivityStatusEnum,
) as Array<TourTrackingActivityStatusEnum>;
