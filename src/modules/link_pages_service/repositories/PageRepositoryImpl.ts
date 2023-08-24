import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { PAGE_INDEX, TENANT_INDEX } from '../utils/constants';
import { PageRepository } from './interfaces/PageRepository';

export default class PageRepositoryImpl implements PageRepository {
  /**
   * Check whether the page is linked to another tenant or not
   * @param pageId ID of page
   * @param tenantId ID of the tenant
   * @param platform The name of social platform
   * @returns true if the page is linked to another tenant otherwise false
   */
  checkPageLinkedToAnotherTenant = async (pageId: string, tenantId: string, platform: string) => {
    const travelTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const linkedPages = await dynamoProvider.query({
      TableName: travelTable,
      IndexName: 'ReverseIndex',
      KeyConditionExpression: 'sk = :sk_pageId AND begins_with(pk, :pk_filter)',
      ExpressionAttributeValues: {
        ':sk_pageId': `${PAGE_INDEX}#${platform.toUpperCase()}#${pageId}`,
        ':pk_filter': `${TENANT_INDEX}#`,
      },
    });
    return linkedPages.length > 1 || linkedPages.some((page) => page.tenantId !== tenantId);
  };
}
