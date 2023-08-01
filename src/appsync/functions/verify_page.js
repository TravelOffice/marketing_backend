/**
 * AWS AppSync Utilities:
 * These are the available AWS AppSync utilities that you can use in your request and response handler.
 * For more information about the utilities that are currently implemented, see
 * https://docs.aws.amazon.com/en_us/appsync/latest/devguide/resolver-reference-overview-js.html#utility-resolvers.
 */
import { util } from '@aws-appsync/utils';

/**
 * Request Handler Function:
 * This function handles an incoming request, then converts it into a request
 * object for the selected data source operation.
 * You can find more code samples here: https://github.com/aws-samples/aws-appsync-resolver-samples.
 * @param {Object} ctx - Contextual information for your resolver invocation.
 * @returns {Object} - A data source request object.
 */
export function request(ctx) {
  let tenant, platform, pageId = "";

  // Get tenant user information from identifying information
  if (ctx.identity.resolverContext) {
    tenant = ctx.identity.resolverContext.tenant;
  } else {
    util.error('VerifyPage: Missing identifying information!');
  }

  const fieldName = ctx.info.fieldName;
  if (!fieldName) {
    util.error("VerifyPage: Missing field name!");
  }

  if (fieldName === "sendMessage") {
    pageId = ctx.arguments.sender;
  } else if (ctx.arguments.pageId) {
    pageId = ctx.arguments.pageId;
  } else {
    util.error('VerifyPage: Missing pageId!');
  }

  const fieldNameLowercase = fieldName.toLowerCase();
  if (ctx.arguments.chatPlatform) {
    platform = ctx.arguments.chatPlatform.toUpperCase();
  } else if (fieldNameLowercase.includes("fb")) {
    platform = "FACEBOOK";
  } else if (fieldNameLowercase.includes("zalo")) {
    platform = "ZALO";
  } else if (fieldNameLowercase.includes("telegram")) {
    platform = "TELEGRAM";
  } else {
    util.error('VerifyPage: Unsupported platform $fieldName!');
  }

  return dynamoDBGetItemRequest({
    pk: `TENANT#${tenant}`,
    sk: `PAGE#${platform}#${pageId}`,
  });
}

/**
 * This function handles the response from the data source.
 * You can find more code samples here: https://github.com/aws-samples/aws-appsync-resolver-samples.
 * @param ctx - Contextual information for your resolver invocation.
 * @returns - A result that is passed to the next function, or the response handler of the pipeline resolver.
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  if (!result) {
    util.error('VerifyPage: Access denied!');
  }
  return result;
}

/**
 * A helper function to get a DynamoDB item
 */
function dynamoDBGetItemRequest(key) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues(key),
  };
}
