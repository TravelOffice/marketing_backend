export interface HandlePaymentOverdueUseCase {
  invoke: (
    tenant: string,
    bookingId: string,
    ruleName: string,
  ) => Promise<void>,
}
