import { ChatPlatform } from 'common-models';
import { dynamoProvider } from 'core';
import { pageRepository, zaloPageRepository } from '../repositories';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';
import { CognitoUser } from '../models/CognitoUser';

export default class LinkZaloPageUseCaseImpl implements LinkZaloPageUseCase {
  /**
   * Link a Zalo Official Account page to a tenant's account.
   * - Step 1: Determine which tenant the current user belongs to
   * - Step 2: Check the page already linked to another tenant or not
   * - Step 3: Get code verifier from db based on state variable
   * - Step 4: Request to zalo to get official account information
   * - Step 5: Save Official account information to dynamodb
   * - Step 6: Delete code verifier in db
   *
   * @param {CognitoUser} currentUser - The current user.
   * @param {string} authorizationCode - The authorization code from Zalo.
   * @param {string} state - The state parameter.
   * @param {string} pageId - The Zalo Official Account page ID.
   * - A promise that resolves with the linked Zalo Official Account information.
   */
  async invoke(currentUser: CognitoUser, authorizationCode: string, state: string, pageId: string) {
    // Determine which tenant the current user belongs to
    const { tenant, username } = currentUser;
    const userAttributes = await dynamoProvider.getTravelUserAttributes(tenant, username);
    if (!userAttributes) {
      throw new Error('User does not exist!');
    }
    const tenantId = userAttributes.tenant;

    // Check whether the page is already linked to another tenant or not
    const isLinkedPage = await pageRepository.checkPageLinkedToAnotherTenant(
      pageId,
      tenantId,
      ChatPlatform.zalo,
    );
    if (isLinkedPage) {
      throw new Error(`Page ${pageId} is already linked to another tenant`);
    }

    // Get code verifier from DynamoDB
    const codeVerifier = await zaloPageRepository.getCodeVerifierFromDynamo(state);

    // Get Zalo official account information
    const page = await zaloPageRepository.getOfficialAccountInfo(
      authorizationCode,
      codeVerifier,
      pageId,
    );

    // Save tokens to DynamoDB
    await zaloPageRepository.saveOAInfoToDynamo(tenantId, page);

    // Delete code verifier in DynamoDB
    await zaloPageRepository.deleteCodeVerifierInDynamo(state);

    return page;
  }
}
