import { TourLocation } from '../../models/TourLocation';

export interface TourLocationRepository {
  generateTourLocationCode: (tenantId: string) => Promise<string>
  list: (tenantId: string) => Promise<Array<TourLocation>>
  create: (tenantId: string, tourLocation: TourLocation) => Promise<TourLocation>
  get: (tenantId: string, id: string) => Promise<TourLocation>
  update: (tenantId: string, id: string, tourLocation: TourLocation) => Promise<TourLocation>
  delete: (tenantId: string, id: string) => Promise<string>
}
