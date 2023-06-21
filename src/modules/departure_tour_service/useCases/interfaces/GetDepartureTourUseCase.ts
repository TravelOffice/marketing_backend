import { DepartureTourWithId } from '../../models/DepartureTour';

export interface GetDepartureTourUseCase {
  invoke: (tenantId: string, departureTourId: string) => Promise<DepartureTourWithId | undefined>;
}
