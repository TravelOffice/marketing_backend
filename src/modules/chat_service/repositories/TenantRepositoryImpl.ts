import { getAwsSecretValue } from 'get-env';
import { DDBMailTemplates } from '../models/dynamodb/DDBMailTemplates';
import { MailKey } from '../models/MailTemplates';
import { dynamoProvider } from '../providers';
import { EMAIL_TEMPLATE_INDEX, TENANT_INDEX } from '../utils/dynamodbConstants';
import { TenantRepository } from './interfaces/TenantRepository';

export default class TenantRepositoryImpl implements TenantRepository {
  getMailTemplate = async (tenant: string, mailKey: MailKey) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const pk = `${TENANT_INDEX}#${tenant}`;
    const sk = EMAIL_TEMPLATE_INDEX;
    const mailTemplatesItem = await dynamoProvider.getItem(travelTable, pk, sk) as DDBMailTemplates;
    if (mailTemplatesItem) {
      return mailTemplatesItem[mailKey];
    }
    throw new Error(`Mail template is undefined, tenant ${tenant} mailKey ${mailKey}`);
  };
}
