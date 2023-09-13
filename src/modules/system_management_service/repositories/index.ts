import TermsAcceptedEvidenceRepositoryImpl from './TermsAcceptedEvidenceRepositoryImpl';
import { TermsAcceptedEvidenceRepository } from './interfaces/TermsAcceptedEvidenceRepository';

interface Repositories {
  marketplaceTermsEvidenceRepository: TermsAcceptedEvidenceRepository,
}

const repositories : Repositories = {
  marketplaceTermsEvidenceRepository: new TermsAcceptedEvidenceRepositoryImpl(),
};

// TODO: Remove below line if there are two or more repository
// eslint-disable-next-line import/prefer-default-export
export const {
  marketplaceTermsEvidenceRepository,
} = repositories;
