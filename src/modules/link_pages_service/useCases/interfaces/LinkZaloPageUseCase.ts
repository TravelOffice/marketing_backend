import { ZaloPage } from 'common-models';

export interface LinkZaloPageUseCase {
  invoke : (
    userId: string,
    authorizationCode: string,
    state: string,
    pageId: string
  ) => Promise<ZaloPage>
}
