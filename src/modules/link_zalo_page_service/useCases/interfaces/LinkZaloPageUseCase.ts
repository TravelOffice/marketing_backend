import { ZaloPage } from '../../models/ZaloPage';

export interface LinkZaloPageUseCase {
  invoke : (
    userId: string,
    authorizationCode: string,
    state: string,
    pageId: string
  ) => Promise<void>
}
