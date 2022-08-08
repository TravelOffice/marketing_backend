export interface DeleteTenantUserUseCase {
  invoke: (tenantId: string, userId: string) => Promise<void>;
}
