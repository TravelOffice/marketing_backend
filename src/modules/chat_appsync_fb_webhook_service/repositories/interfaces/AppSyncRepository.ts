
export interface AppSyncRepository {
  sendReceivedMessageCommand: (webhookEvent: any) => Promise<any>
}
