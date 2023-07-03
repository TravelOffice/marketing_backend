export interface DeleteTourLocationUseCase {
  invoke: (tenantId: string, id: string) => Promise<string>;
}
