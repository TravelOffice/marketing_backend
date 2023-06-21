import { DepartureTourWithId } from '../../models/DepartureTour';

export interface GetDepartureTourListUseCase {
  invoke: (tenantId: string) => Promise<Array<DepartureTourWithId>>;
}
