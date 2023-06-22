export interface DeleteDepartureTourUseCase {
  invoke: (tenantId: string, departureTourId: string) => Promise<string>;
}
