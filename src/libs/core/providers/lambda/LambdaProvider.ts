// ES Modules import
import { InvocationRequest, InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

export { InvocationType, LogType } from '@aws-sdk/client-lambda';

const client = new LambdaClient();

export default class LambdaProvider {
  invokeFunction = async (input: InvocationRequest): Promise<any> => {
    const command = new InvokeCommand(input);
    const { Payload } = await client.send(command);
    if (Payload) {
      const payloadString = Buffer.from(Payload).toString();
      return JSON.parse(payloadString);
    }
    throw new Error('Unable to read payload returned from invocation');
  };
}
