import { DepartureTour } from '../../models/DepartureTour';
import TourOperationStatus from '../../models/TourOperationstatus';

export interface ChangeOperationStatusUseCase {
  invoke: (
    tenantId: string,
    departureTourId: string,
    toOperationStatus: TourOperationStatus,
  ) => Promise<DepartureTour | undefined>;
}
