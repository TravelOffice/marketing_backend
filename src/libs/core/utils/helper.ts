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
   * Method to extract data from an object by given keys.
   * @param obj the original object to be extract
   * @param keys the object's properties to be extract
   * @param removeUndefined
   * @private
   * @return a Partial of given object with only allowed keys.
   */
  extractDataFromObject<T extends Object>(
    obj: T,
    keys: (keyof T)[],
    removeUndefined: boolean = true,
  ) {
    const data: Partial<T> = {};
    keys.forEach((key) => {
      if (!removeUndefined || obj[key] != null) {
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
   * @param quantity The quantity of the generating codes.
   * @returns The generated code.
   */
  generateCode = async (
    table: string,
    pk: string,
    sk: string,
    quantity?: number,
  ): Promise<number> => {
    const updateExpression = 'SET incrIndex = if_not_exists(incrIndex, :start) + :increment';
    const expressionAttributeValues = {
      ':start': 0, // Initial value if the attribute doesn't exist
      ':increment': quantity ?? 1, // Increment value
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

  /**
   * Method to generate update expression, in format:
   * SET #prop = :prop
   * with prop is property of the Lead
   * @param obj data to update
   * @private
   */
  generateUpdateExpression<T>(obj: Partial<T>) {
    return `SET ${Object.keys(obj).map((key) => `#${key} = :${key}`).join(', ')}`;
  }

  /**
   * Method to generate update express names and values in format:
   * - For names: #prop : prop
   * - For values: :prop : value
   * @param obj data to update
   * @private
   */
  generateUpdateExpressionNamesAndValues<T>(obj: Partial<T>) {
    const values: Record<string, any> = {};
    const names: Record<string, string> = {};
    Object.keys(obj).forEach((property) => {
      const key = property as keyof T;
      values[`:${property}`] = obj[key];
      names[`#${property}`] = property;
    });
    return { values, names };
  }

  // This function converts the string to lowercase, then perform the conversion
  toLowerCaseNonAccentVietnamese(str: string) {
    return str.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      // Some system encode vietnamese combining accent as individual utf-8 characters
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
      .replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  }
}
