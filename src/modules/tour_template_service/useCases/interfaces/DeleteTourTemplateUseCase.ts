export interface DeleteTourTemplateUseCase {
  invoke: (tenantId: string, tourTemplateId: string) => Promise<string>;
}
