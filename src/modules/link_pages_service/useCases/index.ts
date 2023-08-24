import GenerateLoginUrlUseCaseImpl from './GenerateLoginUrlUseCaseImpl';
import { GenerateLoginUrlUseCase } from './interfaces/GenerateLoginUrlUseCase';
import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';
import { LinkTelegramPageUseCase } from './interfaces/LinkTelegramPageUseCase';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';
import LinkFacebookPageUseCaseImpl from './LinkFacebookPageUseCaseImpl';
import LinkTelegramPageUseCaseImpl from './LinkTelegramPageUseCaseImpl';
import LinkZaloPageUseCaseImpl from './LinkZaloPageUseCaseImpl';

interface UseCases {
  linkFacebookPageUseCase: LinkFacebookPageUseCase,
  linkZaloPageUseCase: LinkZaloPageUseCase,
  generateLoginUrlUseCase: GenerateLoginUrlUseCase,
  linkTelegramPageUseCase: LinkTelegramPageUseCase,
}

const useCases: UseCases = {
  linkFacebookPageUseCase: new LinkFacebookPageUseCaseImpl(),
  linkZaloPageUseCase: new LinkZaloPageUseCaseImpl(),
  generateLoginUrlUseCase: new GenerateLoginUrlUseCaseImpl(),
  linkTelegramPageUseCase: new LinkTelegramPageUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  linkFacebookPageUseCase,
  linkZaloPageUseCase,
  generateLoginUrlUseCase,
  linkTelegramPageUseCase,
} = useCases;
