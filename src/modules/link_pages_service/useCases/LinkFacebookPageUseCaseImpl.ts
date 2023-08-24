import { ChatPlatform } from 'common-models';
import { dynamoProvider } from 'core';
import { facebookPageRepository, pageRepository } from '../repositories';
import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class LinkFacebookPageUseCaseImpl implements LinkFacebookPageUseCase {
  /**
   * To link a Facebook page, there are steps need to do:
   * - Step 1: Determine which tenant the current user belongs to.
   * - Step 2: Check the page already linked to another tenant or not.
   * - Step 3: Exchange short-live user access token to long-live one.
   * - Step 4: Get page information, included id, name and page access token, etc..
   * - Step 5: Save the page information to correct tenant.
   * - Step 6: Sync Facebook conversations and last messages.
   * @param currentUser the Cognito User
   * @param pageId the Facebook page id
   * @param userAccessToken The Facebook user access token
   */
  invoke = async (currentUser: CognitoUser, pageId: string, userAccessToken: string) => {
    // Determine which tenant the current user belongs to
    const { tenant, username } = currentUser;
    const userAttributes = await dynamoProvider.getTravelUserAttributes(tenant, username);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;

    // Check the page already linked to another tenant or not
    const isLinkedPage = await pageRepository.checkPageLinkedToAnotherTenant(
      pageId,
      tenantId,
      ChatPlatform.facebook,
    );
    if (isLinkedPage) {
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
