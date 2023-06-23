import { dynamoProvider } from '../providers/dynamodb';

const defaultExcludeKeys = [
  'pk',
  'sk',
  'lsi1',
  'lsi2',
  'lsi3',
  'lsi4',
  'lsi5',
];

export default class Helper {
  /**
   * Extracts a subset of properties from an object, excluding specified keys.
   * @param obj The source object.
   * @param excludeKeys The keys to exclude from the extracted data.
   * Default is ['pk', 'sk', 'lsi1', 'lsi2', 'lsi3', 'lsi4', 'lsi5'].
   * @returns The extracted data object containing the specified properties.
   */
  excludeDataFromObject<T extends object>(
    obj: T,
    excludeKeys: (keyof T)[] = defaultExcludeKeys as (keyof T)[],
  ): Partial<T> {
    const data: Partial<T> = {};
    Object.keys(obj).forEach((property) => {
      const key = property as keyof T;
      if (!excludeKeys.includes(key)) {
        data[key] = obj[key];
      }
    });
    return data;
  }

  /**
   * Generates a code by incrementing a counter in the DynamoDB table.
   * @param table The name of the DynamoDB table.
   * @param pk The partition key.
   * @param sk The sort key.
   * @returns The generated code.
   */
  generateCode = async (table: string, pk: string, sk: string): Promise<number> => {
    const updateExpression = 'SET incrIndex = if_not_exists(incrIndex, :start) + :increment';
    const expressionAttributeValues = {
      ':start': 0, // Initial value if the attribute doesn't exist
      ':increment': 1, // Increment value
    };

    const result = await dynamoProvider.updateItem(
      table,
      pk,
      sk,
      updateExpression,
      expressionAttributeValues,
    );
    return result.Attributes!.incrIndex as number;
  };
}
