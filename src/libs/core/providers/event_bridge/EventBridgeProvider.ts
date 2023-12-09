import {
  DeleteRuleCommand,
  EventBridgeClient,
  ListTargetsByRuleCommand,
  PutRuleCommand,
  PutTargetsCommand,
  RemoveTargetsCommand,
  RuleState,
} from '@aws-sdk/client-eventbridge';
// ES Modules import
const client = new EventBridgeClient({
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
  ): Promise<string> => {
    // Define the parameters for creating the EventBridge rule
    const input = {
      Name: ruleName, // Name for the EventBridge rule
      ScheduleExpression: cron, // The cron expression defining the schedule
      State: RuleState.ENABLED, // The state of the rule (ENABLED or DISABLED)
    };
    // Create the EventBridge rule with the specified schedule
    const command = new PutRuleCommand(input);
    await client.send(command);

    // Define the parameters for adding the Lambda function as a target to the rule
    const putTargetsInput = {
      Rule: ruleName, // Name of the EventBridge rule
      Targets: [{
        Id: '1', // Target ID
        Arn: targetArn, // The ARN of the target Lambda function
        Input: targetInput, // The input data to be sent to the target Lambda function
      }],
    };

    const putTargetsCommand = new PutTargetsCommand(putTargetsInput);
    // Add the Lambda function as a target to the EventBridge rule
    await client.send(putTargetsCommand);

    // Return the name of the created rule
    return ruleName;
  };

  /**
   * Deletes an AWS EventBridge rule with the specified rule name.
   *
   * @param {string} ruleName - The name of the EventBridge rule to be deleted.
   * @returns {Promise<void>} - A promise that resolves when the rule is successfully deleted.
   */
  deleteRule = async (ruleName: string): Promise<void> => {
    const listTargetsInput = {
      Rule: ruleName,
    };
    const listTargetsCommand = new ListTargetsByRuleCommand(listTargetsInput);
    const listTargets = await client.send(listTargetsCommand);

    const ids = listTargets.Targets?.map((item) => item.Id!) ?? [];
    const removeTargetsInput = {
      Rule: ruleName,
      Ids: ids,
    };

    const removeTargetsCommand = new RemoveTargetsCommand(removeTargetsInput);
    await client.send(removeTargetsCommand);

    // Remove the EventBridge rule
    const deleteRuleInput = {
      Name: ruleName,
    };
    const deleteRuleCommand = new DeleteRuleCommand(deleteRuleInput);
    await client.send(deleteRuleCommand);
  };
}
