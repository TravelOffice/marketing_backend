import { TelegramBot } from 'common-models';

export interface LinkTelegramPageUseCase {
  invoke : (username: string, token: string) => Promise<Omit<TelegramBot, 'accessToken' | 'secretToken'>>
}
