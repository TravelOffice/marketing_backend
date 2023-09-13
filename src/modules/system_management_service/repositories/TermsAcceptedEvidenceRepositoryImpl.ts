import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { MarketplaceTermsAcceptedEvidence } from '../models/MarketplaceTermsAcceptedEvidence';
import {
  MARKETPLACE_TERMS_ACCEPTED_INDEX,
} from '../utils/constants';
import logger from '../utils/logger';
import { TermsAcceptedEvidenceRepository } from './interfaces/TermsAcceptedEvidenceRepository';

export default class TermsAcceptedEvidenceRepositoryImpl
implements TermsAcceptedEvidenceRepository {
  create = async (
    tenant: string,
    acceptedEvidence: MarketplaceTermsAcceptedEvidence,
  ): Promise<MarketplaceTermsAcceptedEvidence | undefined> => {
    const statisticTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    await dynamoProvider.putItem(
      statisticTable,
      MARKETPLACE_TERMS_ACCEPTED_INDEX,
      tenant,
      acceptedEvidence,
    );

    logger.log(`Created new marketplace accepted terms for tenant ${tenant}`);
    return acceptedEvidence;
  };

  update = async (
    tenant: string,
    acceptedEvidence: Partial<MarketplaceTermsAcceptedEvidence>,
  ): Promise<MarketplaceTermsAcceptedEvidence | undefined> => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const { Attributes: data } = await dynamoProvider.updateItemWithSetExpression(
      marketplaceTable,
      MARKETPLACE_TERMS_ACCEPTED_INDEX,
      tenant,
      acceptedEvidence,
    );

    if (!data) { return undefined; }
    logger.log(`Updated marketplace accepted terms for tenant ${tenant}`);
    return helper.excludeDataFromObject(data) as MarketplaceTermsAcceptedEvidence;
  };

  get = async (tenant: string): Promise<MarketplaceTermsAcceptedEvidence | undefined> => {
    const marketplaceTable = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
    const evidence = await dynamoProvider.getItem(
      marketplaceTable,
      MARKETPLACE_TERMS_ACCEPTED_INDEX,
      tenant,
    );

    if (!evidence) { return undefined; }
    return helper.excludeDataFromObject(evidence) as MarketplaceTermsAcceptedEvidence;
  };
}
