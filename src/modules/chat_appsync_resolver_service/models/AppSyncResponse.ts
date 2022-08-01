export interface AppSyncReponse<T extends any = any> {
  message: string,
  data: T,
  username?: string,
  tenant?: string,
}
