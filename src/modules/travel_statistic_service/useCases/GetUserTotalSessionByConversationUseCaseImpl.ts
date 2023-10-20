import { tenantStatisticRepository } from '../repositories';
import { GetUserTotalSessionByConversationUseCase } from './interfaces/GetUserTotalSessionByConversationUseCase';

export default class GetUserTotalSessionByConversationUseCaseImpl
implements GetUserTotalSessionByConversationUseCase {
  invoke = async (
    tenant: string,
    username: string,
    conversationId: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { username, conversationId },
    );
    return {
      total: records.length,
    };
  };
}
