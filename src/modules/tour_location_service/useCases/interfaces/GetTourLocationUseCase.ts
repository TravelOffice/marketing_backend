import { TourLocation } from '../../models/TourLocation';

export interface GetTourLocationUseCase {
  invoke: (tenantId: string, id: string) => Promise<TourLocation>;
}
