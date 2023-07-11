import { DepartureTour } from '../../models/DepartureTour';

export interface ChangeAssigneeUseCase {
  invoke: (
    tenantId: string,
    departureTourId: string,
    assigneeId: string,
  ) => Promise<DepartureTour | undefined>;
}
