import { ChatPlatform, TelegramBot } from 'common-models';
import { getEnv } from 'get-env';
import * as randomstring from 'randomstring';
import {
  pageRepository, telegramPageRepository, userRepository,
} from '../repositories';
import { TELEGRAM_SECRET_CODE_LENGTH } from '../utils/constants';
import logger from '../utils/logger';
import { LinkTelegramPageUseCase } from './interfaces/LinkTelegramPageUseCase';

export default class LinkTelegramPageUseCaseImpl implements LinkTelegramPageUseCase {
  /**
   * To link a Telegram page, there are steps need to do:
   * - Step 1: Determine which tenant the current user belongs to.
   * - Step 2: Get Telegram bot information
   * - Step 3: Check whether the page is already linked to another tenant or not.
   * - Step 4: Register webhook
   * - Step 5: Save telegram bot information to Dynamo DB
   * @param username the user identifier who made the request to link the page.
   * @param token The Telegram bot token API
   */
  invoke = async (username: string, token: string) => {
    // Determine which tenant the current user belongs to
    const userAttributes = await userRepository.getUserAttributes(username);
    if (!userAttributes) throw new Error('User not existed!');
    const tenantId = userAttributes.tenant;

    // Get Bot information
    const bot: TelegramBot = await telegramPageRepository.getBotInfo(token);

    logger.log(`[LinkTelegramPageUsecase.invoke] Bot information: ${JSON.stringify(bot)}`);

    if (!bot.id) {
      throw new Error('Failed to get telegram bot information');
    }

    // Check whether the page is already linked to another tenant or not
    const isLinkedPage = await pageRepository.checkPageLinkedToAnotherTenant(
      bot.id.toString(),
      tenantId,
      ChatPlatform.telegram,
    );
    if (isLinkedPage) {
      throw new Error(`Page ${bot.id} already linked to another Tenant`);
    }

    // Register webhook
    const secretToken = randomstring.generate(TELEGRAM_SECRET_CODE_LENGTH);
    const webhookUrl = getEnv('TELEGRAM_WEBHOOK_URL');
    const rsRegisterWebhook = await telegramPageRepository.registerWebhook(
      token,
      webhookUrl,
      tenantId,
      secretToken,
    );
    logger.log(`[LinkTelegramPageUsecase.invoke] Register webhook: ${JSON.stringify(rsRegisterWebhook)}`);

    // Save the page information to the correct tenant.
    await telegramPageRepository.saveToDynamo(tenantId, { ...bot, secretToken });

    const { accessToken, ...telegramBot } = bot;

    return telegramBot;
  };
}
