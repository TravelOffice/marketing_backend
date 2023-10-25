import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb';

import {
  BatchGetCommand,
  BatchGetCommandInput,
  BatchWriteCommand,
  BatchWriteCommandInput,
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';
// eslint-disable-next-line import/no-extraneous-dependencies
import { marshall, NativeAttributeValue, unmarshall } from '@aws-sdk/util-dynamodb';
import { getEnv } from 'get-env';
import { helper } from '../../utils';

export type QueryInput = QueryCommandInput;
export type PutItemInput = PutCommandInput;
export type GetItemInput = GetCommandInput;
export type UpdateItemInput = UpdateCommandInput;
export type DeleteItemInput = DeleteCommandInput;
export type BatchGetItemInput = BatchGetCommandInput;
export type KeyList = Record<string, NativeAttributeValue>[];

const client = new DynamoDBClient({ region: getEnv('AWS_REGION') });
const docClient = DynamoDBDocumentClient.from(client);

export type PaginationResponsePayload<T extends Object = any> = {
  data: T[];
  paging: {
    cursors: {
      before: string,
      after: string
    }
  };
}

export type PaginationParams = {
  nextToken?: string,
  limit?: number,
  sortType?: 'ASC' | 'DESC'
}

export default class DynamoProvider {
  /**
   * Insert an item into the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @param data The data to be inserted.
   */
  putItem = async (table: string, pk: string, sk: string, data: any) => {
    const input: PutCommandInput = {
      TableName: table,
      Item: { pk, sk, ...data },
    };
    const command = new PutCommand(input);
    return docClient.send(command);
  };

  /**
   * Retrieve an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @returns The retrieved item if found, undefined otherwise.
   */
  getItem = async <T = any>(table: string, pk: string, sk: string) => {
    const input: GetCommandInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const command = new GetCommand(input);
    const { Item } = await docClient.send(command);
    if (!Item) {
      return undefined;
    }
    return Item as T;
  };

  /**
   * Perform a paginated query on DynamoDB.
   *
   * @template T - The type of items in the query result.
   * @param input
   * @param {PaginationParams} paginationParams - The pagination parameters.
   * @param {Array<keyof T>} [excludeKeys] - Optional keys to exclude from the response data.
   * @returns {Promise<PaginationResponsePayload<T> | undefined>}
   * - A promise that resolves to the paginated query result or undefined if no data is found.
   */
  queryPagination = async <T extends object = any>(
    input: QueryCommandInput,
    paginationParams: PaginationParams,
    excludeKeys?: (keyof T)[],
  ): Promise<PaginationResponsePayload<T> | undefined> => {
    // Set a default pagination limit
    const defaultPaginationLimit = 10;

    // Extract pagination parameters from the input
    const { nextToken, limit, sortType } = paginationParams;

    // Determine the pagination limit
    const paginationLimit = limit || defaultPaginationLimit;

    const command = new QueryCommand({
      ...input,
      ScanIndexForward: sortType === 'ASC', // Default, sort record DESC
      Limit: Number(paginationLimit),
      ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
    });
    // Perform the DynamoDB query
    const { Items, LastEvaluatedKey } = await client.send(command);

    // Process the query result
    if (Items) {
      // If there are items, create the paginated response payload
      return {
        data: Items.map((item: any) => helper.excludeDataFromObject(item, excludeKeys)),
        paging: {
          cursors: {
            before: LastEvaluatedKey ? JSON.stringify(LastEvaluatedKey) : '', // Set the 'before' cursor
            after: nextToken || '', // Set the 'after' cursor
          },
        },
      } as PaginationResponsePayload<T>;
    }

    // If no items are found, return undefined
    return undefined;
  };

  /**
   * Perform a query on the DynamoDB table.
   * @returns An array of items matching the query.
   * @param input
   */
  query = async <T = any>(input: QueryCommandInput): Promise<T[]> => {
    const command = new QueryCommand(input);
    const { Items } = await docClient.send(command);
    if (Items) {
      return Items as T[];
    }
    return [];
  };

  /**
   * Update an item in the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @param updateExpression The update expression.
   * @param expressionAttributeValues The attribute values used in the update expression.
   * @param expressionAttributeNames Optional. The attribute names used in the update expression.
   * @returns The updated item.
   */
  updateItem = async (
    table: string,
    pk: string,
    sk: string,
    updateExpression: string,
    expressionAttributeValues: {
      [key: string]: any
    },
    expressionAttributeNames?: {
      [key: string]: string
    },
  ) => {
    const input: UpdateCommandInput = {
      TableName: table,
      Key: { pk, sk },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    };
    const command = new UpdateCommand(input);
    return docClient.send(command);
  };

  updateItemWithSetExpression = async (
    table: string,
    pk: string,
    sk: string,
    values: {
      [key: string]: any
    },
  ) => {
    // Build expression dynamically
    const updateExpression = helper.generateUpdateExpression(values);
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(values);

    // Update item
    const input: UpdateCommandInput = {
      TableName: table,
      Key: { pk, sk },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNamesAndValues.names,
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ReturnValues: 'ALL_NEW',
    };

    const command = new UpdateCommand(input);
    return docClient.send(command);
  };

  updateItemWithPrebuiltExpression = async (
    input: UpdateCommandInput,
  ) => docClient.send(new UpdateCommand(input));

  /**
   * Delete an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   */
  deleteItem = async (table: string, pk: string, sk: string) => {
    const input: DeleteCommandInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const command = new DeleteCommand(input);

    await docClient.send(command);
  };

  /**
   * Batch get items from DynamoDB
   * @param batchGetInput Batch get input
   * @returns BynamoDB items
   */
  batchGetItems = async (batchGetInput: BatchGetCommandInput) => {
    // TODO: See docs https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html for limitations
    const command = new BatchGetCommand(batchGetInput);
    const { Responses: tableItems = [] } = await docClient.send(command);
    return tableItems as Record<string, Record<string, any>[]>;
  };

  /**
   * Batch write items into DynamoDB
   * @param batchWriteInput Batch write input
   */
  batchWriteItem = async (
    batchWriteInput: BatchWriteCommandInput,
  ) => docClient.send(new BatchWriteCommand(batchWriteInput));

  marshall = (data: any) => marshall(data);

  unmarshall = (obj: AttributeValue) => unmarshall(obj);
}
