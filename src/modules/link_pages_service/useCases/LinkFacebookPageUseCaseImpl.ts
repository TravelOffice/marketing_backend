import { facebookPageRepository, userRepository } from '../repositories';
import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';

export default class LinkFacebookPageUseCaseImpl implements LinkFacebookPageUseCase {
  /**
   * To link a Facebook page, there are steps need to do:
   * - Step 1: Determine which tenant the current user belongs to.
   * - Step 2: Check the page already linked to another tenant or not.
   * - Step 3: Exchange short-live user access token to long-live one.
   * - Step 4: Get page information, included id, name and page access token, etc..
   * - Step 5: Save the page information to correct tenant.
   * - Step 6: Sync Facebook conversations and last messages.
   * @param currentUserId the user idenitifier who made the request to link her page.
   * @param pageId the Facebook page id
   * @param userAccessToken The Facebook user access token
   */
  invoke = async (currentUserId: string, pageId: string, userAccessToken: string) => {
    // Determine which tenant the current user belongs to
    const userAttributes = await userRepository.getUserAttributes(currentUserId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;

    // Check the page already linked to another tenant or not
    if (await facebookPageRepository.checkPageLinkedToAnotherTenant(pageId, tenantId)) {
      throw new Error(`Page ${pageId} already linked to another Tenant`);
    }

    // Exchange short-live user access token to long-live one
    const longLiveToken = await facebookPageRepository.exchangeUserAccessToken(userAccessToken);

    // Get page information, included id, name and page access token, etc..
    const page = await facebookPageRepository.getPageAccessToken(pageId, longLiveToken);

    // Save the page information to correct tenant.
    await facebookPageRepository.saveToDynamo(tenantId, page);
    // 4. TODO: Sync conversations, messages
  };
}
