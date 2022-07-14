import { zaloPageRepository, userRepository } from '../repositories';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';

export default class LinkZaloPageUseCaseImpl implements LinkZaloPageUseCase {
  /**
   * To link a Zalo page, there are steps need to do:
   * - Step 1: Determine which tenant the current user belongs to
   * - Step 2: Check the page already linked to another tenant or not
   * - Step 3: Get code verifier from db based on state variable
   * - Step 4: Request to zalo to get official account information
   * - Step 5: Save Official account information to dynamodb
   * - Step 6: Delete code verifier in db
   * @param currentUserId the user idenitifier who made the request to link her page.
   * @param pageId the Facebook page id
   * @param userAccessToken The Facebook user access token
   */
  invoke = async (userId: string, authorizationCode: string, state: string, pageId: string) => {
    // Determine which tenant the current user belongs to
    const userAttributes = await userRepository.getUserAttributes(userId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;

    // Check the page already linked to another tenant or not
    if (await zaloPageRepository.checkPageLinkedToAnotherTenant(pageId, tenantId)) {
      throw new Error(`Page ${pageId} already linked to another Tenant`);
    }

    // Get code verifier from dynamo
    const codeVerifier = await zaloPageRepository.getCodeVerifierFromDynamo(state);
    // Get Zalo official account information
    const page = await zaloPageRepository.getOfficialAccountInfo(
      authorizationCode,
      codeVerifier,
      pageId,
    );
    // Save tokens to dynamo db
    await zaloPageRepository.saveOAInfoToDynamo(tenantId, page);
    // Delete code verifier in db
    await zaloPageRepository.deleteCodeVerifierInDynamo(state);
    return page;
  };
}
