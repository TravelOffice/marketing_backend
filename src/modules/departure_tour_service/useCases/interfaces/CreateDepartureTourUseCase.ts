import { DepartureTour } from '../../models/DepartureTour';

export interface CreateDepartureTourUseCase {
  invoke: (tenantId: string, departureTour: DepartureTour) => Promise<DepartureTour>;
}
