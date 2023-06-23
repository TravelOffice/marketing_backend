import { DepartureTour } from '../../models/DepartureTour';

export interface DepartureTourRepository {
  generateDepartureTourCode: (tenantId: string) => Promise<number>
  list: (tenantId: string) => Promise<Array<DepartureTour>>
  create: (tenantId: string, departureTour: DepartureTour) => Promise<DepartureTour>
  get: (tenantId: string, departureTourId: string) => Promise<DepartureTour | undefined>
  update: (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour
    ) => Promise<DepartureTour>
  delete: (tenantId: string, departureTourId: string) => Promise<string>
}
