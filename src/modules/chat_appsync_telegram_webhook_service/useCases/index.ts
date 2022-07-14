import { ReceiveTelegramWebhookUseCase } from './interfaces/ReceiveTelegramWebhookUseCase';
import ReceiveTelegramWebhookUseCaseImpl from './ReceiveTelegramWebhookUseCaseImpl';

interface UseCases {
  receiveTelegramWebhookUseCase: ReceiveTelegramWebhookUseCase,
}

const useCases : UseCases = {
  receiveTelegramWebhookUseCase: new ReceiveTelegramWebhookUseCaseImpl(),
};

export const {
  receiveTelegramWebhookUseCase,
} = useCases;
