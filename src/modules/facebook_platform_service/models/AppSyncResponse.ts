import { AppSyncMessageHandlingReponse } from './AppSyncMessageHandlingResponse';
import { AppSyncNotificationResponse } from './AppSyncNotificationResponse';

export type AppSyncReponse = AppSyncMessageHandlingReponse | AppSyncNotificationResponse;
