import AWS from 'aws';

const eventBridge = new AWS.EventBridge({
  apiVersion: '2015-10-07',
});
export default class EventBridgeProvider {
  /**
   * Creates an AWS EventBridge rule with the provided schedule and target Lambda function.
   *
   * @param {string} ruleName - The name for the EventBridge rule to be created.
   * @param {string} cron - The cron expression that defines the schedule for the rule.
   * @param {string} targetArn - The Amazon Resource Name (ARN) of the target Lambda function.
   * @param {string} targetInput - The input data to be sent to the target Lambda function.
   * @returns {Promise<string>} - A promise that resolves to the name of the created rule.
   */
  createRule = async (
    ruleName: string,
    cron: string,
    targetArn: string,
    targetInput: string,
  ) => {
    // Define the parameters for creating the EventBridge rule
    const ruleParams = {
      Name: ruleName, // Name for the EventBridge rule
      ScheduleExpression: cron, // The cron expression defining the schedule
      State: 'ENABLED', // The state of the rule (ENABLED or DISABLED)
    };

    // Create the EventBridge rule with the specified schedule
    await eventBridge.putRule(ruleParams).promise();

    // Define the parameters for adding the Lambda function as a target to the rule
    const targetParams = {
      Rule: ruleName, // Name of the EventBridge rule
      Targets: [{
        Id: '1', // Target ID
        Arn: targetArn, // The ARN of the target Lambda function
        Input: targetInput, // The input data to be sent to the target Lambda function
      }],
    };

    // Add the Lambda function as a target to the EventBridge rule
    await eventBridge.putTargets(targetParams).promise();

    // Return the name of the created rule
    return ruleName;
  };

  /**
   * Deletes an AWS EventBridge rule with the specified rule name.
   *
   * @param {string} ruleName - The name of the EventBridge rule to be deleted.
   * @returns {Promise<void>} - A promise that resolves when the rule is successfully deleted.
   */
  deleteRule = async (ruleName: string) => {
    const listTargets = await eventBridge.listTargetsByRule({
      Rule: ruleName,
    }).promise();
    const ids = listTargets.Targets?.map((item) => item.Id) ?? [];
    await eventBridge.removeTargets({
      Rule: ruleName,
      Ids: ids,
    }).promise();
    // Use the `eventBridge.deleteRule` method to remove the EventBridge rule
    await eventBridge.deleteRule({
      Name: ruleName, // Name of the EventBridge rule to be deleted
    }).promise();
  };
}
