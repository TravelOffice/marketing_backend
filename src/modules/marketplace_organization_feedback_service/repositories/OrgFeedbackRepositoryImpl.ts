import { dynamoProvider, helper, logger } from 'core';
import { getAwsSecretValue } from 'get-env';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import { OrgFeedback } from '../models/OrgFeedback';
import { OrgFeedbackRepository } from './interfaces/OrgFeedbackRepository';
import {
  FEEDBACK_COUNTER_INDEX,
  FEEDBACK_INDEX,
  MARKETPLACE_COUNTER_INDEX,
  ORGANIZATION_INDEX,
} from '../utils/constants';

export default class OrgFeedbackRepositoryImpl implements OrgFeedbackRepository {
  /**
   * Lists all feedback for the specified organization.
   *
   * @param {string} organizationId - The ID of the organization.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns - A promise resolving to a paginated response.
   */
  listByOrg = async (organizationId: string, paginationParams: PaginationParams) => {
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${ORGANIZATION_INDEX}#${organizationId}#${FEEDBACK_INDEX}`,
      },
    };
    return dynamoProvider.queryPagination(
      queryParams,
      paginationParams,
    );
  };

  /**
   * Retrieves a feedback by its ID and organization ID.
   *
   * @param organizationId - The ID of the organization.
   * @param feedbackId - The ID of the feedback.
   * @returns A Promise that resolves to the retrieved feedback, or undefined if not found.
   */
  get = async (organizationId: string, feedbackId: string) => dynamoProvider.getItem<OrgFeedback>(
    await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
    `${ORGANIZATION_INDEX}#${organizationId}#${FEEDBACK_INDEX}`,
    feedbackId,
  );

  /**
   * Creates a new feedback for the specified organization.
   *
   * @param feedback - The feedback object to create.
   * @returns A Promise that resolves to the created feedback.
   */
  create = async (feedback: OrgFeedback) => {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${feedback.organizationId}#${FEEDBACK_INDEX}`,
      `${feedback.code}`,
      feedback,
    );
    return feedback;
  };

  /**
   * Updates a feedback for the specified organization.
   *
   * @param organizationId - The ID of the organization.
   * @param feedbackId - The ID of the feedback to update.
   * @param feedback - The partial feedback object with the updated fields.
   * @returns A Promise that resolves to the updated feedback.
   */
  update = async (
    organizationId: string,
    feedbackId: string,
    feedback: Partial<OrgFeedback>,
  ) => {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(feedback);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: `${ORGANIZATION_INDEX}#${organizationId}#${FEEDBACK_INDEX}`,
        sk: feedbackId,
      },
      UpdateExpression: helper.generateUpdateExpression(feedback),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as OrgFeedback;
  };

  /**
   * Deletes a feedback for the specified organization.
   *
   * @param organizationId
   * @param feedbackId - The ID of the feedback to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  delete = async (organizationId: string, feedbackId: string) => {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${ORGANIZATION_INDEX}#${organizationId}#${FEEDBACK_INDEX}`,
      feedbackId,
    );
  };

  /**
   * Method to generate organization feedback code which is user-readable
   */
  generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
      const count = await helper.generateCode(
        table,
        MARKETPLACE_COUNTER_INDEX,
        FEEDBACK_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log('Error during increment operation for organization feedback');
      throw error;
    }
  };
}
