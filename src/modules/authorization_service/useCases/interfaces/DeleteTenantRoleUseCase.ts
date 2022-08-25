export interface DeleteTenantRoleUseCase {
  invoke: (tenantId: string, roleName: string) => Promise<void>
}
