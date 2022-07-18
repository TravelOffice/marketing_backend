export interface UserRepository {
  isRootOrAdmin: (tenantId: string, userId: string) => Promise<boolean>
}
