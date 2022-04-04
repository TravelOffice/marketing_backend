import { GenerateLoginUrlUseCase } from './interfaces/GenerateLoginUrlUseCase';
import GenerateLoginUrlUseCaseImpl from './GenerateLoginUrlUseCaseImpl';
import { LinkZaloPageUseCase } from './interfaces/LinkZaloPageUseCase';
import LinkZaloPageUseCaseImpl from './LinkZaloPageUseCaseImpl';

interface UseCases {
  generateLoginUrlUseCase: GenerateLoginUrlUseCase,
  linkZaloPageUseCase: LinkZaloPageUseCase,
}

const useCases : UseCases = {
  generateLoginUrlUseCase: new GenerateLoginUrlUseCaseImpl(),
  linkZaloPageUseCase: new LinkZaloPageUseCaseImpl(),
};

// eslint-disable-next-line import/prefer-default-export
export const {
  generateLoginUrlUseCase,
  linkZaloPageUseCase,
} = useCases;
