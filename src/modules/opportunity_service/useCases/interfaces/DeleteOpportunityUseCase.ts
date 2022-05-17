export interface DeleteOpportunityUseCase {
  invoke: (
    id: string,
    userId: string,
    leadId: string,
  ) => Promise<void>;
}
