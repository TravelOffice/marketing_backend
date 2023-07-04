export interface DeleteReceiptUseCase {
  invoke: (tenantId: string, id: string) => Promise<string>;
}
