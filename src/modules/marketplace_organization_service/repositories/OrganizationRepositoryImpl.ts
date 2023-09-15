import { getAwsSecretValue } from 'get-env';
import {
  dynamoProvider, helper, logger, s3Provider,
} from 'core';
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
   * @param id - The ID of the tenant.
   * @returns A Promise that resolves to the retrieved organization, or undefined if not found.
   */
  async get(id: string): Promise<Organization | undefined> {
    return dynamoProvider.getItem<Organization>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      id,
    );
  }

  /**
   * Creates a new organization for the specified tenant.
   *
   * @param id - The ID of the tenant.
   * @param organization - The organization object to create.
   * @returns A Promise that resolves to the created organization.
   */
  async create(id: string, organization: Organization): Promise<Organization> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      id,
      organization,
    );
    return organization;
  }

  /**
   * Updates an organization for the specified tenant.
   *
   * @param id - The ID of the tenant.
   * @param organization - The partial organization object with the updated fields.
   * @returns A Promise that resolves to the updated organization.
   */
  async update(
    id: string,
    organization: Partial<Organization>,
  ): Promise<Organization> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(organization);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: ORGANIZATION_INDEX,
        sk: id,
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
   * @param id - The ID of the tenant.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      ORGANIZATION_INDEX,
      id,
    );
  }

  /**
   * Deletes a thumbnail image from an S3 bucket based on its CDN URL.
   *
   * @param {string} cdnUrl - The CDN URL of the thumbnail image to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is successful.
   * @throws {Error} If an error occurs during the deletion process.
   */
  async deleteProfilePicture(cdnUrl?: string): Promise<void> {
    if (!cdnUrl) {
      // If CDN URL is not provided, nothing to delete
      return;
    }

    try {
      // Extract the key from the CDN URL
      const bucket = await getAwsSecretValue('MARKETPLACE_FILE_BUCKET');
      const cdnHostName = await getAwsSecretValue('MARKETPLACE_FILE_CDN');
      const key = cdnUrl.replace(`${cdnHostName}/`, '');

      // Delete the object from the S3 bucket
      await s3Provider.deleteObject(bucket, key);

      logger.log(`Deleted thumbnail: ${cdnUrl}`);
    } catch (error) {
      logger.log(`Error deleting thumbnail: ${error}`);
      throw error;
    }
  }
}
