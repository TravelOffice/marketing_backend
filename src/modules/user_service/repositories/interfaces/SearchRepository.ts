export interface SearchRepository {
  generateSearchToken: (apiKey: string) => Promise<string>
  generateApiKeys: (tenantId: string, userId: string) => Promise<string>
}
