import { getAwsSecretValue } from 'get-env';
import { dynamoProvider, helper } from 'core';
import { Organization } from '../models/Organization';
import { OrganizationRepository } from './interfaces/OrganizationRepository';
import { ORGANIZATION_INDEX } from '../utils/constants';

export default class OrganizationRepositoryImpl implements OrganizationRepository {
  /**
   * Lists all organizations.
   *
   * @returns A Promise that resolves to an array of organizations.
   */
  async list(): Promise<Organization[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': ORGANIZATION_INDEX,
      },
    });
  }

  /**
   * Retrieves an organization by tenant ID.
   *
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves to the retrieved organization, or undefined if not found.
   */
  async get(tenantId: string): Promise<Organization | undefined> {
    return dynamoProvider.getItem<Organization>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      tenantId,
    );
  }

  /**
   * Creates a new organization for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param organization - The organization object to create.
   * @returns A Promise that resolves to the created organization.
   */
  async create(tenantId: string, organization: Organization): Promise<Organization> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      tenantId,
      organization,
    );
    return organization;
  }

  /**
   * Updates an organization for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param organization - The partial organization object with the updated fields.
   * @returns A Promise that resolves to the updated organization.
   */
  async update(
    tenantId: string,
    organization: Partial<Organization>,
  ): Promise<Organization> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(organization);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: ORGANIZATION_INDEX,
        sk: tenantId,
      },
      UpdateExpression: helper.generateUpdateExpression(organization),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as Organization;
  }

  /**
   * Deletes an organization for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(tenantId: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      tenantId,
    );
  }
}
