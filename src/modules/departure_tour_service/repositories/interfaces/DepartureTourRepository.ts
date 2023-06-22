import { DepartureTour, DepartureTourWithId } from '../../models/DepartureTour';

export interface DepartureTourRepository {
  list: (tenantId: string) => Promise<Array<DepartureTourWithId>>
  create: (tenantId: string, departureTour: DepartureTour) => Promise<DepartureTourWithId>
  get: (tenantId: string, departureTourId: string) => Promise<DepartureTourWithId | undefined>
  update: (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour
    ) => Promise<DepartureTourWithId>
  delete: (tenantId: string, departureTourId: string) => Promise<string>
}
