import { AppSyncEvent } from '../models';
import { AppSyncReponse } from '../models/AppSyncResponse';

export interface AppSyncHandler {
  handle: (event: AppSyncEvent) => Promise<AppSyncReponse>
}
