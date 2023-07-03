import { TourLocation } from '../../models/TourLocation';

export interface UpdateTourLocationUseCase {
  invoke: (tenantId: string, id: string, tourLocation: TourLocation) => Promise<TourLocation>;
}
