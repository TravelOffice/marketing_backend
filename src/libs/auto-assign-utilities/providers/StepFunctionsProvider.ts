import {
  SendTaskSuccessCommand,
  SendTaskSuccessInput,
  SFNClient,
  StartExecutionCommand,
  StartExecutionInput,
} from '@aws-sdk/client-sfn'; // ES Modules import
import logger from '../utils/logger';

const client = new SFNClient();

export default class StepFunctionsProvider {
  /**
   * Start execution AWS StepFunctions
   * @param input Start execution input including sfn arn, name, input data as payload
   */
  startExecution = async (input: StartExecutionInput) => {
    const data = await client.send(new StartExecutionCommand(input));
    logger.log(`[StepFunctionsProvider] Started AWS StepFunctions with information ${JSON.stringify(data, null, 2)}`);
  };

  /**
   * Send task success to AWS StepFunctions
   * @param input Send task success input
   */
  sendTaskSuccess = async (input: SendTaskSuccessInput) => {
    const data = await client.send(new SendTaskSuccessCommand(input));
    logger.log(`[StepFunctionsProvider] Sent task success with response data ${JSON.stringify(data, null, 2)}`);
  };
}
