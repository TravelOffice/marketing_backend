export interface DeleteOpportunityUseCase {
  invoke: (
    id: string,
    userId: string,
  ) => Promise<void>;
}
