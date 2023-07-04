import { Receipt } from '../../models/Receipt';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreateReceiptUseCase {
  invoke: (userInfo: CognitoUser, receipt: Receipt) => Promise<Receipt>;
}
