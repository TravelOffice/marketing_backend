import CreateMarketplaceTermsEvidenceUseCaseImpl from './CreateMarketplaceTermsEvidenceUseCaseImpl';
import GetMarketplaceTermsEvidenceUseCaseImpl from './GetMarketplaceTermsEvidenceUseCaseImpl';
import { CreateMarketplaceTermsEvidenceUseCase } from './interfaces/CreateMarketplaceTermsEvidenceUseCase';
import { GetMarketplaceTermsEvidenceUseCase } from './interfaces/GetMarketplaceTermsEvidenceUseCase';

interface UseCases {
  createMarketplaceTermsEvidenceUseCase: CreateMarketplaceTermsEvidenceUseCase,
  getMarketplaceTermsEvidenceUseCase: GetMarketplaceTermsEvidenceUseCase,
}

const useCases : UseCases = {
  createMarketplaceTermsEvidenceUseCase: new CreateMarketplaceTermsEvidenceUseCaseImpl(),
  getMarketplaceTermsEvidenceUseCase: new GetMarketplaceTermsEvidenceUseCaseImpl(),
};

export const {
  createMarketplaceTermsEvidenceUseCase,
  getMarketplaceTermsEvidenceUseCase,
} = useCases;
