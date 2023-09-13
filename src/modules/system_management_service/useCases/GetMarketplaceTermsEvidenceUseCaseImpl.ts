import { CognitoUser } from '../models/CognitoUser';
import { marketplaceTermsEvidenceRepository } from '../repositories';
import { GetMarketplaceTermsEvidenceUseCase } from './interfaces/GetMarketplaceTermsEvidenceUseCase';

export default class GetMarketplaceTermsEvidenceUseCaseImpl
implements GetMarketplaceTermsEvidenceUseCase {
  invoke = async (currentUser: CognitoUser) => {
    const { tenant } = currentUser;
    return marketplaceTermsEvidenceRepository.get(tenant);
  };
}
