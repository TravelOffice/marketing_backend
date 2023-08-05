import { DepartureTour } from '../../models/DepartureTour';

export interface DepartureTourRepository {
  get: (tenantId: string, departureTourId: string) => Promise<DepartureTour | undefined>
}
