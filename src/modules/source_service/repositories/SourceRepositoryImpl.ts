import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { Source } from '../models/Source';
import { SourceRepository } from './interfaces/SourceRepository';
import { SOURCE_COUNTER_INDEX, SOURCE_INDEX, TENANT_INDEX } from '../utils/constants';

/**
 * Implementation of the SourceRepository interface.
 */
export default class SourceRepositoryImpl implements SourceRepository {
  /**
   * Lists all sources for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves to an array of sources.
   */
  async list(tenantId: string): Promise<Source[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      },
    });
  }

  /**
   * Retrieves a source by its ID and tenant ID.
   *
   * @param tenantId - The ID of the tenant.
   * @param id - The ID of the source.
   * @returns A Promise that resolves to the retrieved source, or undefined if not found.
   */
  async get(tenantId: string, id: string): Promise<Source|undefined> {
    return dynamoProvider.getItem<Source>(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      id,
    );
  }

  /**
   * Creates a new source for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param source - The source object to create.
   * @returns A Promise that resolves to the created source.
   */
  async create(tenantId: string, source: Source): Promise<Source> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      `${source.code}`,
      source,
    );
    return source;
  }

  /**
   * Updates a source for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param id - The ID of the source to update.
   * @param source - The partial source object with the updated fields.
   * @returns A Promise that resolves to the updated source.
   */
  async update(tenantId: string, id: string, source: Partial<Source>): Promise<Source> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(source);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Key: {
        pk: `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
        sk: `${id}`,
      },
      UpdateExpression: helper.generateUpdateExpression(source),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as Source;
  }

  /**
   * Deletes a source for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param id - The ID of the source to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(tenantId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${SOURCE_INDEX}`,
      `${id}`,
    );
  }

  /**
   * Generates a source code for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @returns A Promise that resolves to the generated source code.
   */
  async generateSourceCode(tenantId: string): Promise<string> {
    const code = await helper.generateCode(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}`,
      SOURCE_COUNTER_INDEX,
    );
    return code.toString();
  }
}
