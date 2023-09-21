// TODO: Declare use cases which can be used in this service here

import CreatePaymentVoucherUseCaseImpl from './CreatePaymentVoucherUseCaseImpl';
import DeletePaymentVoucherUseCaseImpl from './DeletePaymentVoucherUseCaseImpl';
import GetPaymentVoucherListUseCaseImpl from './GetPaymentVoucherListUseCaseImpl';
import GetPaymentVoucherUseCaseImpl from './GetPaymentVoucherUseCaseImpl';
import UpdatePaymentVoucherUseCaseImpl from './UpdatePaymentVoucherUseCaseImpl';
import { CreatePaymentVoucherUseCase } from './interfaces/CreatePaymentVoucherUseCase';
import { DeletePaymentVoucherUseCase } from './interfaces/DeletePaymentVoucherUseCase';
import { GetPaymentVoucherListUseCase } from './interfaces/GetPaymentVoucherListUseCase';
import { GetPaymentVoucherUseCase } from './interfaces/GetPaymentVoucherUseCase';
import { UpdatePaymentVoucherUseCase } from './interfaces/UpdatePaymentVoucherUseCase';
import { GetPaymentVouchersOfTourUseCase } from './interfaces/GetPaymentVouchersOfTourUseCase';
import GetPaymentVouchersOfTourUseCaseImpl from './GetPaymentVouchersOfTourUseCaseImpl';
import { ApprovePaymentVoucherUseCase } from './interfaces/ApprovePaymentVoucherUseCase';
import ApprovePaymentVoucherUseCaseImpl from './ApprovePaymentVoucherUseCaseImpl';

interface UseCases {
  createPaymentVoucherUseCase: CreatePaymentVoucherUseCase,
  deletePaymentVoucherUseCase: DeletePaymentVoucherUseCase,
  getPaymentVoucherListUseCase: GetPaymentVoucherListUseCase,
  getPaymentVouchersFromOpTourUseCase: GetPaymentVouchersOfTourUseCase,
  getPaymentVoucherUseCase: GetPaymentVoucherUseCase,
  updatePaymentVoucherUseCase: UpdatePaymentVoucherUseCase,
  approvePaymentVoucherUseCase: ApprovePaymentVoucherUseCase,
}

const useCases: UseCases = {
  createPaymentVoucherUseCase: new CreatePaymentVoucherUseCaseImpl(),
  deletePaymentVoucherUseCase: new DeletePaymentVoucherUseCaseImpl(),
  getPaymentVoucherListUseCase: new GetPaymentVoucherListUseCaseImpl(),
  getPaymentVouchersFromOpTourUseCase: new GetPaymentVouchersOfTourUseCaseImpl(),
  getPaymentVoucherUseCase: new GetPaymentVoucherUseCaseImpl(),
  updatePaymentVoucherUseCase: new UpdatePaymentVoucherUseCaseImpl(),
  approvePaymentVoucherUseCase: new ApprovePaymentVoucherUseCaseImpl(),
};

export const {
  createPaymentVoucherUseCase,
  deletePaymentVoucherUseCase,
  getPaymentVoucherListUseCase,
  getPaymentVouchersFromOpTourUseCase,
  getPaymentVoucherUseCase,
  updatePaymentVoucherUseCase,
  approvePaymentVoucherUseCase,
} = useCases;
