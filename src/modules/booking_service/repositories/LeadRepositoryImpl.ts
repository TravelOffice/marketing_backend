/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { Lead } from '../models/Lead';
import { LEAD_INDEX, TENANT_INDEX } from '../utils/constants';
import { LeadRepository } from './interfaces/LeadRepository';

export default class LeadRepositoryImpl implements LeadRepository {
  getById = async (tenantId: string, leadId: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenantId}#${LEAD_INDEX}`;
    const sk = `${leadId}`;
    return dynamoProvider.getItem<Lead>(travelTable, pk, sk);
  };
}
