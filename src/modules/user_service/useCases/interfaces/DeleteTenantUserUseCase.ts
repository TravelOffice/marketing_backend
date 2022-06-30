export interface DeleteTenantUserUseCase {
  invoke: (authenticatedUserName: string, userId: string) => Promise<void>;
}
