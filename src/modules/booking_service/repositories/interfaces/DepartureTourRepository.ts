import { DepartureTour } from '../../models/tour/DepartureTour';

export interface DepartureTourRepository {
  getDepartureTour: (tenant: string, id: string) => Promise<DepartureTour | undefined>,
  update: (
    tenantId: string,
    departureTourId: string,
    departureTour: Partial<DepartureTour>
  ) => Promise<DepartureTour>
}
