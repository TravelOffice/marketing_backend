import { facebookPageRepository, userRepository } from '../repositories';
import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';

export default class LinkFacebookPageUseCaseImpl implements LinkFacebookPageUseCase {
  /**
   * To link a Facebook page, there are steps need to do:
   * - Step 1: Exchange short-live user access token to long-live one.
   * - Step 2: Get page information, included id, name and page access token, etc..
   * - Step 3: Determine which tenant the current user belongs to.
   * - Step 4: Save the page information to correct tenant.
   * - Step 5: Sync Facebook conversations and last messages.
   * @param currentUserId the user idenitifier who made the request to link her page.
   * @param pageId the Facebook page id
   * @param userAccessToken The Facebook user access token
   */
  invoke = async (currentUserId: string, pageId: string, userAccessToken: string) => {
    const longLiveToken = await facebookPageRepository.exchangeUserAccessToken(userAccessToken);
    const page = await facebookPageRepository.getPageAccessToken(pageId, longLiveToken);
    const userAttributes = await userRepository.getUserAttributes(currentUserId);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;
    await facebookPageRepository.saveToDynamo(tenantId, page);
    // 4. TODO: Sync conversations, messages
  };
}
