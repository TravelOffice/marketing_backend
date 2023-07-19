import { DepartureTour } from '../../models/DepartureTour';
import TourOperationStatus from '../../models/TourOperationstatus';
import { User } from '../../models/User';

export interface DepartureTourRepository {
  generateDepartureTourCode: (tenantId: string) => Promise<string>
  list: (tenantId: string) => Promise<Array<DepartureTour>>
  create: (tenantId: string, departureTour: DepartureTour) => Promise<DepartureTour>
  get: (tenantId: string, departureTourId: string) => Promise<DepartureTour | undefined>
  update: (
    tenantId: string,
    departureTourId: string,
    departureTour: DepartureTour
  ) => Promise<DepartureTour>
  delete: (tenantId: string, departureTourId: string) => Promise<string>
  changeAssignee: (
    tenantId: string,
    departureTourId: string,
    assignee: User,
  ) => Promise<DepartureTour>
  changeOperationStatus: (
    tenantId: string,
    departureTourId: string,
    toOperationStatus: TourOperationStatus,
  ) => Promise<DepartureTour>
}
