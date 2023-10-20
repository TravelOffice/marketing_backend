import { tenantStatisticRepository } from '../repositories';
import { GetOrgTotalSessionByConversationUseCase } from './interfaces/GetOrgTotalSessionByConversationUseCase';

export default class GetOrgTotalSessionByConversationUseCaseImpl
implements GetOrgTotalSessionByConversationUseCase {
  invoke = async (
    tenant: string,
    conversationId: string,
  ) => {
    const records = await tenantStatisticRepository.getTotalSessionOrgByParams(
      tenant,
      { conversationId },
    );
    return {
      total: records.length,
    };
  };
}
