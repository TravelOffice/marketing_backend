import { TourLocation } from '../../models/TourLocation';

export interface TourLocationRepository {
  get(tenantId: string, locationId: string): Promise<TourLocation|undefined>
}
