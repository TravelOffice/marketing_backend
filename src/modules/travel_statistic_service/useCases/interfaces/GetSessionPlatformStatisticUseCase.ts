export interface GetSessionPlatformStatisticUseCase {
  invoke(
    tenant: string,
    startTime: string,
    endTime: string,
  ): Promise<any>;
}
