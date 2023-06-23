import { DepartureTour } from '../../models/DepartureTour';

export interface GetDepartureTourUseCase {
  invoke: (tenantId: string, departureTourId: string) => Promise<DepartureTour | undefined>;
}
