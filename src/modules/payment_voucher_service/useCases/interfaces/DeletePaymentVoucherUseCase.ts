export interface DeletePaymentVoucherUseCase {
  invoke: (tenantId: string, id: string) => Promise<string>;
}
