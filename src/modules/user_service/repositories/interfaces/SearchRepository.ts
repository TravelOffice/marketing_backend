import { User } from '../../models';

export interface SearchRepository {
  generateSearchToken: (apiKey: string) => Promise<string>
  getApiKeys: (user: User) => Promise<string>
}
