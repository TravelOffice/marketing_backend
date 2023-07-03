import { TourLocation } from '../../models/TourLocation';

export interface CreateTourLocationUseCase {
  invoke: (tenantId: string, tourLocation: TourLocation) => Promise<TourLocation>;
}
