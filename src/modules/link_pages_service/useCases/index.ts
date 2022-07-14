import GenerateLoginUrlUseCaseImpl from './GenerateLoginUrlUseCaseImpl';
import { GenerateLoginUrlUseCase } from './interfaces/GenerateLoginUrlUseCase';
import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';
import LinkFacebookPageUseCaseImpl from './LinkFacebookPageUseCaseImpl';
import LinkZaloPageUseCaseImpl from './LinkZaloPageUseCaseImpl';

interface UseCases {
  linkFacebookPageUseCase: LinkFacebookPageUseCase,
  linkZaloPageUseCase: LinkZaloPageUseCase,
  generateLoginUrlUsecCase: GenerateLoginUrlUseCase,
}

const useCases : UseCases = {
  linkFacebookPageUseCase: new LinkFacebookPageUseCaseImpl(),
  linkZaloPageUseCase: new LinkZaloPageUseCaseImpl(),
  generateLoginUrlUsecCase: new GenerateLoginUrlUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  linkFacebookPageUseCase,
  linkZaloPageUseCase,
  generateLoginUrlUsecCase,
} = useCases;
