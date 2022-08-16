import AWS from 'aws';
import logger from '../utils/logger';

const stepfunctions = new AWS.StepFunctions();

type AWSSfnStartExecutionInput = AWS.StepFunctions.Types.StartExecutionInput;
type AWSSfnSendTaskSuccessInput = AWS.StepFunctions.Types.SendTaskSuccessInput;

export default class StepFunctionsProvider {
  /**
   * Start execution AWS StepFunctions
   * @param input Start execution input including sfn arn, name, input data as payload
   */
  startExecution = async (input: AWSSfnStartExecutionInput) => {
    const data = await stepfunctions.startExecution(input).promise();

    logger.log(`[sqsAutoAssignTriggerLambda] Started AWS StepFunctions with information ${JSON.stringify(data, null, 2)}`);
  };

  /**
   * Send task success to AWS StepFunctions
   * @param input Send task success input
   */
  sendTaskSuccess = async (input: AWSSfnSendTaskSuccessInput) => {
    const data = await stepfunctions.sendTaskSuccess(input).promise();

    logger.log(`[sqsAutoAssignTriggerLambda] Sent task success with response data ${JSON.stringify(data, null, 2)}`);
  };
}
