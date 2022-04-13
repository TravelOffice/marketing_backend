import { LinkFacebookPageUseCase } from './interfaces/LinkFacebookPageUseCase';
import LinkFacebookPageUseCaseImpl from './LinkFacebookPageUseCaseImpl';

interface UseCases {
  linkFacebookPageUseCase: LinkFacebookPageUseCase,
}

const useCases : UseCases = {
  linkFacebookPageUseCase: new LinkFacebookPageUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  linkFacebookPageUseCase,
} = useCases;
