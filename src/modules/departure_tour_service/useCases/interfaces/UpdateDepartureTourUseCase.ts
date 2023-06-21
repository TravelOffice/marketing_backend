import { DepartureTour } from '../../models/DepartureTour';

export interface UpdateDepartureTourUseCase {
  invoke: (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour
    ) => Promise<DepartureTour>;
}
