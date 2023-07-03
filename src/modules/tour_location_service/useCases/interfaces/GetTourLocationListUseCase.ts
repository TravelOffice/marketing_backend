import { TourLocation } from '../../models/TourLocation';

export interface GetTourLocationListUseCase {
  invoke: (tenantId: string) => Promise<Array<TourLocation>>;
}
