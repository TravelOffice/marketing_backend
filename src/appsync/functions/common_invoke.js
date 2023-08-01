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
  return {
    operation: "Invoke",
    payload: {
      field: ctx.info.fieldName,
      tenant: ctx.identity.resolverContext.tenant,
      username: ctx.identity.resolverContext.username,
      arguments: ctx.arguments,
    },
  };
}

/**
 * Response Handler Function:
 * This function handles the response from the data source.
 * You can find more code samples here: https://github.com/aws-samples/aws-appsync-resolver-samples.
 * @param {Object} ctx - Contextual information for your resolver invocation.
 * @returns {Object} - A result that is passed to the next function or the response handler of the pipeline resolver.
 */
export function response(ctx) {
  const { error, result } = ctx;
  if (error) {
    return util.appendError(error.message, error.type, result);
  }
  return ctx.result;
}
