export interface GetUserAverageResponseTimeUseCase {
  invoke(
    tenant: string,
    username: string,
    startTime: string,
  ): Promise<{total_session: number, average_duration: number}>;
}
