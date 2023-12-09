export interface GetOrgAverageResponseTimeUseCase {
  invoke(
    tenant: string,
    startTime: string,
  ): Promise<{total_session: number, average_duration: number}>;
}
