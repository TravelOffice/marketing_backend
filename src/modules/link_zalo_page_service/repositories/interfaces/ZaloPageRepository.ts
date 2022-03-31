import { ZaloPage } from '../../models/ZaloPage';

export interface ZaloPageRepository {
  generateCodeChallenge: (
  ) => Promise<{codeVerifier: string, state: string, codeChallenge: string}>,
  generateLoginUrl: (codeChallenge: string, state: string) => Promise<string>,
  getOfficialAccountInfo: (authorizationCode: string, codeVerifier: string, pageId: string
  ) => Promise<ZaloPage>,
  getCodeVerifierFromDynamo: (state: string) => Promise<string>,
  saveCodeVerifierToDynamo: (codeVerifier: string, state: string) => Promise<void>,
  saveOAInfoToDynamo: (tenantId: string, page: ZaloPage) => Promise<void>,
  deleteCodeVerifierInDynamo: (state: string) => Promise<void>,
}
