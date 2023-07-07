import AWS from 'aws';

const lambda = new AWS.Lambda();

const invokeFunction = async (params: AWS.Lambda.Types.InvocationRequest): Promise<any> => {
  const { Payload: payloadString } = await lambda.invoke(params).promise();
  if (payloadString && typeof payloadString === 'string') {
    return JSON.parse(payloadString);
  }
  throw new Error('Unable to read payload returned from invocation');
};

export default invokeFunction;
