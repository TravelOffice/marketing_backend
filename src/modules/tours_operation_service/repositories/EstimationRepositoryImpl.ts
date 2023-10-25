import { dynamoProvider, helper } from 'core';
import { getAwsSecretValue } from 'get-env';
import { Estimation } from '../models/Estimation';
import { EstimationRepository } from './interfaces/EstimationRepository';
import { ESTIMATION_COUNTER_INDEX, ESTIMATION_INDEX, TENANT_INDEX } from '../utils/constants';

export default class EstimationRepositoryImpl implements EstimationRepository {
  /**
   * Lists all estimations for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param tourId - The ID of the tour operation
   * @returns A Promise that resolves to an array of estimations.
   */
  async list(tenantId: string, tourId: string): Promise<Estimation[]> {
    return dynamoProvider.query({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${TENANT_INDEX}#${tenantId}#${ESTIMATION_INDEX}#${tourId}`,
      },
    });
  }

  /**
   * Retrieves an estimation by its ID and tenant ID.
   *
   * @param tenantId - The ID of the tenant.
   * @param tourId - The ID of the tour operation
   * @param id - The ID of the estimation.
   * @returns A Promise that resolves to the retrieved estimation, or undefined if not found.
   */
  async get(tenantId: string, tourId: string, id: string): Promise<Estimation | undefined> {
    return dynamoProvider.getItem<Estimation>(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${ESTIMATION_INDEX}#${tourId}`,
      id,
    );
  }

  /**
   * Creates a new estimation for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param estimation - The estimation object to create.
   * @param tourId - The ID of the tour operation
   * @returns A Promise that resolves to the created estimation.
   */
  async create(
    tenantId: string,
    tourId: string,
    estimation: Estimation,
  ): Promise<Estimation> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${ESTIMATION_INDEX}#${tourId}`,
      `${estimation.code}`,
      estimation,
    );
    return estimation;
  }

  /**
   * Updates an estimation for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param tourId - The operation tour id
   * @param id - The ID of the estimation to update.
   * @param estimation - The partial estimation object with the updated fields.
   * @returns A Promise that resolves to the updated estimation.
   */
  async update(
    tenantId: string,
    tourId: string,
    id: string,
    estimation: Partial<Estimation>,
  ): Promise<Estimation> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(estimation);
    const result = await dynamoProvider.updateItemWithPrebuiltExpression({
      TableName: await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      Key: {
        pk: `${TENANT_INDEX}#${tenantId}#${ESTIMATION_INDEX}#${tourId}`,
        sk: `${id}`,
      },
      UpdateExpression: helper.generateUpdateExpression(estimation),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as Estimation;
  }

  /**
   * Deletes an estimation for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param tourId - The operation tour id
   * @param id - The ID of the estimation to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(tenantId: string, tourId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}#${ESTIMATION_INDEX}#${tourId}`,
      `${id}`,
    );
  }

  /**
   * Generates an estimation code for the specified tenant.
   *
   * @param tenantId - The ID of the tenant.
   * @param tourId - The operation tour id
   * @returns A Promise that resolves to the generated estimation code.
   */
  async generateId(tenantId: string, tourId: string): Promise<string> {
    const code = await helper.generateCode(
      await getAwsSecretValue('DYNAMO_TRAVEL_TABLE'),
      `${TENANT_INDEX}#${tenantId}`,
      `${ESTIMATION_COUNTER_INDEX}#${tourId}`,
    );
    return code.toString();
  }
}
