import logger from './utils/logger';
import { handlePaymentOverdueUseCase } from './useCases';

export const handler = async (tenant: string, booking: string, ruleName: string) => {
  try {
    await handlePaymentOverdueUseCase.invoke(tenant, booking, ruleName);
  } catch (error: any) {
    logger.log(`[handlePaymentOverdueLambda] Error ${error}`);
  }
};
