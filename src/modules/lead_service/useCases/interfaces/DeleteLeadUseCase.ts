export interface DeleteLeadUseCase {
  invoke: (tenantId: string, leadId: string) => Promise<void>;
}
