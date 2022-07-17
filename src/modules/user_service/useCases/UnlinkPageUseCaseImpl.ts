import { ChatPlatform } from 'common-models';
import { pageRepository, telegramRepository, userRepository } from '../repositories';
import { UnlinkPageUseCase } from './interfaces/UnlinkPageUseCase';

export default class UnlinkPageUseCaseImpl implements UnlinkPageUseCase {
  /**
   * Method to delete a linked page
   * To delete a linked page, there are steps need to do:
   * - Step 1: Confirm the user information existed in Dynamo DB
   * - Step 2: TODO Check current user has permission to delete the linked page
   * - Step 3: Get the current tenant from authenticated user
   * - Step 4: Delete the linked page from dynamodb
   * @param username The username of retrieve user
   * @param pageId The id of page
   * @param platform The platform of page
   * @returns void
   */
  invoke = async (username: string, platform: ChatPlatform, pageId: string) => {
    const userAttributes = await userRepository.getUserAttributes(username);
    if (!userAttributes) throw new Error(`Your account [${username}] not existed!`);

    // TODO: Need check user permission before delete linked pages

    // Get the current tenant from authenticated user
    const tenantId = userAttributes.tenant;
    if (!tenantId) throw new Error(`User [${username}] is missing tenant attribute`);

    // Delete webhook in case unlink Telegram Bot
    if (platform === ChatPlatform.telegram) {
      const telegramBot = await telegramRepository.get(tenantId, pageId);
      if (telegramBot) {
        await telegramRepository.deleteWebhook(telegramBot.accessToken);
      } else {
        throw new Error(`Telegram Bot ${pageId} isn't linked`);
      }
    }

    // Get the linked page
    return pageRepository.delete(tenantId, platform, pageId);
  };
}
