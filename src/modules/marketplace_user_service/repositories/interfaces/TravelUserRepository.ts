import { TravelUser } from '../../models';

export interface TravelUserRepository {
  get: (tenant: string, username: string) => Promise<TravelUser | undefined>;
}
