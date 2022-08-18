import { DDBUser } from '../../models/dynamodb/DDBUser';

export interface UserRepository {
  getEmployee: (tenant: string, userId: string) => Promise<DDBUser | undefined>

  updateNumberOfAssignedChats: (
    user: DDBUser,
    numberOfChats: number,
    waitingChatResponse?: boolean,
  ) => Promise<void>
}
