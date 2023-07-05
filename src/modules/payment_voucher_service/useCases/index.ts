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

interface UseCases {
  createPaymentVoucherUseCase: CreatePaymentVoucherUseCase,
  deletePaymentVoucherUseCase: DeletePaymentVoucherUseCase,
  getPaymentVoucherListUseCase: GetPaymentVoucherListUseCase,
  getPaymentVoucherUseCase: GetPaymentVoucherUseCase,
  updatePaymentVoucherUseCase: UpdatePaymentVoucherUseCase,
}

const useCases: UseCases = {
  createPaymentVoucherUseCase: new CreatePaymentVoucherUseCaseImpl(),
  deletePaymentVoucherUseCase: new DeletePaymentVoucherUseCaseImpl(),
  getPaymentVoucherListUseCase: new GetPaymentVoucherListUseCaseImpl(),
  getPaymentVoucherUseCase: new GetPaymentVoucherUseCaseImpl(),
  updatePaymentVoucherUseCase: new UpdatePaymentVoucherUseCaseImpl(),
};

export const {
  createPaymentVoucherUseCase,
  deletePaymentVoucherUseCase,
  getPaymentVoucherListUseCase,
  getPaymentVoucherUseCase,
  updatePaymentVoucherUseCase,
} = useCases;
