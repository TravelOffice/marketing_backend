export interface HandlePaymentPendingUseCase {
  invoke: (
    tenant: string,
    bookingId: string,
    deadline: string,
  ) => Promise<string>,
}
