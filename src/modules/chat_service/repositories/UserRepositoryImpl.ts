import { getAwsSecretValue } from 'get-env';
import { dynamoProvider } from 'core';
import { DDBUser } from '../models/dynamodb/DDBUser';
import { EMPLOYEE_INDEX, TENANT_INDEX } from '../utils/dynamodbConstants';
import logger from '../utils/logger';
import { UserRepository } from './interfaces/UserRepository';

export default class UserRepositoryImpl implements UserRepository {
  /**
   * Function used to get user object from userId
   * @param tenant Tenant
   * @param userId User ID
   * @returns Promise of User
   */
  getEmployee = async (tenant: string, userId: string) => {
    const ddbTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    return dynamoProvider.getItem<DDBUser>(
      ddbTable,
      `${TENANT_INDEX}#${tenant}`,
      `${EMPLOYEE_INDEX}#${userId}`,
    );
  };

  /**
   * Update number of assigned chats for user
   * Each time new conversation is assigned to sale user, this value has to be updated
   * Also, decrease or increase this value for unassigned and new assigned user
   * @param user DynamoDB user object
   * @param numberOfChats Number of assigned chats to update
   * @param waitingChatResponse Flag to check whether user is processing by auto assign workflows
   */
  updateNumberOfAssignedChats = async (
    user: DDBUser,
    numberOfChats: number,
    waitingChatResponse: boolean = false,
  ) => {
    const ddbTable = await getAwsSecretValue('DYNAMO_TRAVEL_TABLE');
    const updatedAt = Date.now();
    const updatedUser = await dynamoProvider.updateItemWithSetExpression(
      ddbTable,
      user.pk,
      user.sk,
      {
        updatedAt,
        nacs: numberOfChats,
        wct: waitingChatResponse,
      },
    );
    logger.log(`User has been updated, new user information ${updatedUser}`);
  };
}
