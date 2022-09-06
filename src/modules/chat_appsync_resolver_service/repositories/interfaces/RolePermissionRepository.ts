export interface RolePermissionRepository {
  hasPermission: (
    tenantId: string, roles: Array<string>, permissionName: string,
  ) => Promise<boolean>
}
