import { ReceiveWebhookUseCase } from './interfaces/ReceiveWebhookUseCase';
import ReceiveWebhookUseCaseImpl from './ReceiveWebhookUseCaseImpl';

interface UseCases {
  receiveWebhookUseCase: ReceiveWebhookUseCase,
}

const useCases : UseCases = {
  receiveWebhookUseCase: new ReceiveWebhookUseCaseImpl(),
};

export const {
  receiveWebhookUseCase,
} = useCases;
