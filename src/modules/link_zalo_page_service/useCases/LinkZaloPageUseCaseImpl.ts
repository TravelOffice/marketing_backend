import { zaloPageRepository, userRepository } from '../repositories';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';

export default class LinkZaloPageUseCaseImpl implements LinkZaloPageUseCase {
  /**
   * To link a Zalo page, there are steps need to do:
   * - Step 1: Get code verifier from db based on state variable
   * - Step 2: Request to zalo to get official account information
   * - Step 3: Save Official account information to dynamodb
   * - Step 4: Delete code verifier in db
   * @param currentUserId the user idenitifier who made the request to link her page.
   * @param pageId the Facebook page id
   * @param userAccessToken The Facebook user access token
   */
  invoke = async (userId: string, authorizationCode: string, state: string, pageId: string) => {
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User not existed!');
    // Get code verifier from dynamo
    const codeVerifier = await zaloPageRepository.getCodeVerifierFromDynamo(state);
    // Get Zalo official account information
    const page = await zaloPageRepository.getOfficialAccountInfo(authorizationCode, codeVerifier, pageId);
    const tenantId = userAttributes.tenant;
    // Save tokens to dynamo db
    await zaloPageRepository.saveOAInfoToDynamo(tenantId, page);
    // Delete code verifier in db
    await zaloPageRepository.deleteCodeVerifierInDynamo(state);
    return page;
  };
}
