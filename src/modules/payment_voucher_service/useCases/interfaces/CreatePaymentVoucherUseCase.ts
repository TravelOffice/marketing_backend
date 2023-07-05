import { PaymentVoucher } from '../../models/PaymentVoucher';
import { CognitoUser } from '../../models/CognitoUser';

export interface CreatePaymentVoucherUseCase {
  invoke: (userInfo: CognitoUser, paymentVoucher: PaymentVoucher) => Promise<PaymentVoucher>;
}
