import { dynamoProvider, helper, logger } from 'core';
import { getAwsSecretValue } from 'get-env';
import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { PostComment } from '../models/PostComment';
import { PostCommentRepository } from './interfaces/PostCommentRepository';
import {
  COMMENT_COUNTER_INDEX, COMMENT_INDEX, MARKETPLACE_COUNTER_INDEX, POST_INDEX,
} from '../utils/constants';

export default class PostCommentRepositoryImpl implements PostCommentRepository {
  /**
   * Lists all comments for the specified post.
   *
   * @param tourPostId - The ID of the post.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload<PostComment>>>}
   * - A promise resolving to a paginated response.
   */
  async listByPost(
    tourPostId: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<PostComment> | undefined> {
    const queryParams = {
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': `${POST_INDEX}#${tourPostId}#${COMMENT_INDEX}`,
      },
    };
    return dynamoProvider.queryPagination(
      queryParams,
      paginationParams,
    );
  }

  /**
   * Retrieves a comment by its ID and post ID.
   *
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the comment.
   * @returns A Promise that resolves to the retrieved comment, or undefined if not found.
   */
  async get(tourPostId: string, id: string): Promise<PostComment | undefined> {
    return dynamoProvider.getItem<PostComment>(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${tourPostId}#${COMMENT_INDEX}`,
      id,
    );
  }

  /**
   * Creates a new comment for the specified post.
   *
   * @param comment - The comment object to create.
   * @returns A Promise that resolves to the created comment.
   */
  async create(comment: PostComment): Promise<PostComment> {
    await dynamoProvider.putItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${comment.tourPostId}#${COMMENT_INDEX}`,
      `${comment.code}`,
      comment,
    );
    return comment;
  }

  /**
   * Updates a comment for the specified post.
   *
   * @param tourPostId - The ID of the post.
   * @param id - The ID of the comment to update.
   * @param comment - The partial comment object with the updated fields.
   * @returns A Promise that resolves to the updated comment.
   */
  async update(
    tourPostId: string,
    id: string,
    comment: Partial<PostComment>,
  ): Promise<PostComment> {
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(comment);
    const result = await dynamoProvider.rawUpdateItem({
      TableName: await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      Key: {
        pk: `${POST_INDEX}#${tourPostId}#${COMMENT_INDEX}`,
        sk: `${id}`,
      },
      UpdateExpression: helper.generateUpdateExpression(comment),
      ReturnValues: 'ALL_NEW',
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ExpressionAttributeNames: expressionNamesAndValues.names,
    });
    return result.Attributes as PostComment;
  }

  /**
   * Deletes a comment for the specified post.
   *
   * @param tourPostId
   * @param id - The ID of the comment to delete.
   * @returns A Promise that resolves when the deletion is complete.
   */
  async delete(tourPostId: string, id: string): Promise<void> {
    await dynamoProvider.deleteItem(
      await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE'),
      `${POST_INDEX}#${tourPostId}#${COMMENT_INDEX}`,
      `${id}`,
    );
  }

  /**
   * Method to generate post comment code which is user-readable
   */
  generateCode = async () => {
    try {
      const table = await getAwsSecretValue('DYNAMO_MARKETPLACE_TABLE');
      const count = await helper.generateCode(
        table,
        MARKETPLACE_COUNTER_INDEX,
        COMMENT_COUNTER_INDEX,
      );
      return count.toString();
    } catch (error) {
      logger.log('Error during increment operation for post comment');
      throw error;
    }
  };
}
