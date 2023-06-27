export interface DeleteCustomerUseCase {
  invoke: (tenantId: string, customerId: string) => Promise<void>;
}
