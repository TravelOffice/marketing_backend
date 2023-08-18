import AWS from 'aws';
import { getEnv } from 'get-env';
import { helper } from '../../utils';

export type PutItemInput = AWS.DynamoDB.DocumentClient.PutItemInput;
export type GetItemInput = AWS.DynamoDB.DocumentClient.GetItemInput;
export type UpdateItemInput = AWS.DynamoDB.DocumentClient.UpdateItemInput;
export type QueryInput = AWS.DynamoDB.DocumentClient.QueryInput;
export type DeleteItemInput = AWS.DynamoDB.DocumentClient.DeleteItemInput;
export type BatchGetItemInput = AWS.DynamoDB.DocumentClient.BatchGetItemInput;
export type BatchWriteItemInput = AWS.DynamoDB.DocumentClient.BatchWriteItemInput;
export type KeyList = AWS.DynamoDB.DocumentClient.KeyList;
export type AttributeValues = AWS.DynamoDB.AttributeMap;

const dynamoDB: AWS.DynamoDB.DocumentClient = new AWS.DynamoDB.DocumentClient({ region: getEnv('AWS_REGION') });

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
  sortDesc?: boolean,
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
    const params: PutItemInput = {
      TableName: table,
      Item: { pk, sk, ...data },
    };
    return dynamoDB.put(params).promise();
  };

  /**
   * Retrieve an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @returns The retrieved item if found, undefined otherwise.
   */
  getItem = async <T = any>(table: string, pk: string, sk: string): Promise<T | undefined> => {
    const params: GetItemInput = {
      TableName: table,
      Key: { pk, sk },
    };
    const { Item } = await dynamoDB.get(params).promise();
    if (!Item) {
      return undefined;
    }
    return Item as T;
  };

  /**
   * Executes a paginated query on the DynamoDB table based on the provided query parameters
   * and pagination settings.
   *
   * @param {QueryInput} queryParams - The query parameters for the DynamoDB query.
   * @param {PaginationParams} paginationParams - The pagination settings.
   * @returns {Promise<PaginationResponsePayload>} - A promise resolving to a paginated response.
   */
  queryPagination = async <T extends object = any>(
    queryParams: QueryInput,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<T> | undefined> => {
    // Set a default pagination limit
    const defaultPaginationLimit = 10;

    // Extract pagination parameters from the input
    const { nextToken, limit, sortDesc } = paginationParams;

    // Determine the pagination limit
    const paginationLimit = limit || defaultPaginationLimit;

    // Perform the DynamoDB query
    const { Items, LastEvaluatedKey } = await dynamoDB.query({
      ...queryParams,
      ScanIndexForward: !!sortDesc, // Default, sort record DESC
      Limit: paginationLimit,
      ExclusiveStartKey: nextToken ? JSON.parse(nextToken) : undefined,
    }).promise();

    // Process the query result
    if (Items) {
      // If there are items, create the paginated response payload
      return {
        data: Items.map((item: any) => helper.excludeDataFromObject(item)),
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
   * @param params The query parameters.
   * @returns An array of items matching the query.
   */
  query = async <T = any>(params: QueryInput): Promise<T[]> => {
    const { Items } = await dynamoDB.query(params).promise();
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
    expressionAttributeValues: { [key: string]: any },
    expressionAttributeNames?: AWS.DynamoDB.DocumentClient.ExpressionAttributeNameMap,
  ) => {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
      TableName: table,
      Key: { pk, sk },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: 'ALL_NEW',
    };
    return dynamoDB.update(params).promise();
  };

  updateItemWithSetExpression = async (
    table: string,
    pk: string,
    sk: string,
    values: { [key: string]: any },
  ) => {
    // Build expression dynamically
    const updateExpression = helper.generateUpdateExpression(values);
    const expressionNamesAndValues = helper.generateUpdateExpressionNamesAndValues(values);

    // Update item
    const params: UpdateItemInput = {
      TableName: table,
      Key: { pk, sk },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionNamesAndValues.names,
      ExpressionAttributeValues: expressionNamesAndValues.values,
      ReturnValues: 'ALL_NEW',
    };
    return dynamoDB.update(params).promise();
  };

  /**
   * Delete an item from the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   */
  deleteItem = async (table: string, pk: string, sk: string) => {
    const params: DeleteItemInput = {
      TableName: table,
      Key: { pk, sk },
    };
    await dynamoDB.delete(params).promise();
  };

  /**
   * Raw update item to DynamoDB
   * @param input Update item input
   * @returns Item
   */
  rawUpdateItem = async (input: UpdateItemInput) => dynamoDB.update(input).promise();

  /**
   * Batch get items from DynamoDB
   * @param batchGetInput Batch get input
   * @returns BynamoDB items
   */
  batchGetItems = async (batchGetInput: BatchGetItemInput) => {
    // TODO: See docs https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html for limitations
    const { Responses: tableItems = [] } = await dynamoDB.batchGet(batchGetInput).promise();
    return tableItems as AWS.DynamoDB.DocumentClient.BatchGetResponseMap;
  };

  /**
   * Batch write items into DynamoDB
   * @param batchWriteInput Batch write input
   */
  batchWriteItem = async (
    batchWriteInput: BatchWriteItemInput,
  ) => dynamoDB.batchWrite(batchWriteInput).promise();

  marshall = (data: any) => AWS.DynamoDB.Converter.marshall(data);

  unmarshall = (obj: AttributeValues) => AWS.DynamoDB.Converter.unmarshall(obj);
}
