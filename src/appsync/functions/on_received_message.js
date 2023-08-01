/**
 * AWS AppSync Utilities:
 * These are the available AWS AppSync utilities that you can use in your request and response handler.
 * For more information about the utilities that are currently implemented, see
 * https://docs.aws.amazon.com/en_us/appsync/latest/devguide/resolver-reference-overview-js.html#utility-resolvers.
 */

import { util } from '@aws-appsync/utils';

/**
 * Request Handler Function:
 * This function is invoked before the request handler of the first AppSync function in the pipeline.
 * The resolver request handler allows you to perform some preparation logic
 * before executing the defined functions in your pipeline.
 * @param {Object} ctx - Contextual information for your resolver invocation.
 * @returns {Object} - The request payload with required information.
 */
export function request(ctx) {
  return {
    version: "2017-02-28",
    payload: {
      body: ctx.arguments.body,
      from: ctx.identity.resolverContext.username,
      to: ctx.arguments.to,
      sentAt: util.time.nowISO8601()
    }
  };
}

/**
 * Pipeline Functions Behavior:
 * Pipeline functions run in sequence between the request and response handler.
 * The resolver's request handler result is made available to the first function as ctx.prev.result.
 * Each function's response handler result is available to the next function as ctx.prev.result.
 */

/**
 * Response Handler Function:
 * This function is invoked after the response handler of the last AppSync function in the pipeline.
 * The resolver response handler allows you to perform some final evaluation logic
 * from the output of the last function to the expected GraphQL field type.
 * @param {Object} ctx - Contextual information for your resolver invocation.
 * @returns {Object} - The response result from the last function in the pipeline.
 */
export function response(ctx) {
  // Extracting tenant, username, and permissions from identifying information
  let tenant, username, permissions = [];
  if (ctx.identity.resolverContext) {
    tenant = ctx.identity.resolverContext.tenant;
    username = ctx.identity.resolverContext.username;
    permissions = JSON.parse(ctx.identity.resolverContext.permissions);
  } else {
    util.error('OnReceivedMessage: Missing identifying information!');
  }

  /**
   * Setting up subscription filtering.
   * Each web client represents an individual user and can only receive conversations assigned to them.
   * - Tenant root account can receive all the conversations related to tenant pages.
   * - Employee user can only receive assigned conversations.
   * The subscription filter is combined by two conditions with OR operator as follows:
   */
  if (permissions.includes("view_all_conversations")) {
    // Root or admin can get all the messages related to the tenant
    extensions.setSubscriptionFilter({
      "filterGroup": [{
        "filters": [
          {
            "fieldName": "tenant",
            "operator": "eq",
            "value": tenant
          }
        ]
      }]
    });
  } else {
    // Message information should match both tenant and username
    extensions.setSubscriptionFilter({
      "filterGroup": [{
        "filters": [
          {
            "fieldName": "tenant",
            "operator": "eq",
            "value": tenant
          },
          {
            "fieldName": "username",
            "operator": "eq",
            "value": username
          }
        ]
      }]
    });
  }

  return ctx.result;
}
