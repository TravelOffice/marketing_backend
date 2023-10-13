import { handler } from '../handleNotificationLambda';
import { ddbStreamEvent } from './testEvent';

handler(ddbStreamEvent);
