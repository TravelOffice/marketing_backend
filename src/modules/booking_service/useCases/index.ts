import CreateBookingUseCaseImpl from './CreateBookingUseCaseImpl';
import { CreateBookingUseCase } from './interfaces/CreateBookingUseCase';
import { GetBookingByGivenIdUseCase } from './interfaces/GetBookingByGivenIdUseCase';
import GetBookingByGivenIdUseCaseImpl from './GetBookingByGivenIdUseCaseImpl';
import { GetAllBookingUseCase } from './interfaces/GetAllBookingUseCase';
import GetAllBookingUseCaseImpl from './GetAllBookingUseCaseImpl';
import { CancelBookingUseCase } from './interfaces/CancelBookingUseCase';
import CancelBookingUseCaseImpl from './CancelBookingUseCaseImpl';
import { GetBookingsByStatusUseCase } from './interfaces/GetBookingsByStatusUseCase';
import GetBookingsByStatusUseCaseImpl from './GetBookingsByStatusUseCaseImpl';
import { UpdateBookingUseCase } from './interfaces/UpdateBookingUseCase';
import UpdateBookingUseCaseImpl from './UpdateBookingUseCaseImpl';
import CreateBookingFromLeadUseCaseImpl from './CreateBookingFromLeadUseCaseImpl';
import { CreateBookingFromLeadUseCase } from './interfaces/CreateBookingFromLeadUseCase';
import { SendEmailToTourOperatorUseCase } from './interfaces/SendEmailToTourOperatorUseCase';
import SendEmailToTourOperatorImpl from './SendEmailToTourOperatorImpl';
import { ConfirmBookingUseCase } from './interfaces/ConfirmBookingUseCase';
import ConfirmBookingUseCaseImpl from './ConfirmBookingUseCaseImpl';

interface UseCases {
  createBookingUseCase: CreateBookingUseCase,
  createBookingFromLeadUseCase: CreateBookingFromLeadUseCase,
  updateBookingUseCase: UpdateBookingUseCase,
  getBookingByGivenIdUseCase: GetBookingByGivenIdUseCase,
  getAllBookingsUseCase: GetAllBookingUseCase,
  getBookingsByStatusUseCase: GetBookingsByStatusUseCase,
  cancelBookingsUseCase: CancelBookingUseCase,
  sendEmailToTourOperator: SendEmailToTourOperatorUseCase,
  confirmBookingUseCase: ConfirmBookingUseCase,
}

const useCases: UseCases = {
  createBookingUseCase: new CreateBookingUseCaseImpl(),
  createBookingFromLeadUseCase: new CreateBookingFromLeadUseCaseImpl(),
  updateBookingUseCase: new UpdateBookingUseCaseImpl(),
  getBookingByGivenIdUseCase: new GetBookingByGivenIdUseCaseImpl(),
  getAllBookingsUseCase: new GetAllBookingUseCaseImpl(),
  getBookingsByStatusUseCase: new GetBookingsByStatusUseCaseImpl(),
  cancelBookingsUseCase: new CancelBookingUseCaseImpl(),
  sendEmailToTourOperator: new SendEmailToTourOperatorImpl(),
  confirmBookingUseCase: new ConfirmBookingUseCaseImpl(),
};

export const {
  createBookingUseCase,
  createBookingFromLeadUseCase,
  updateBookingUseCase,
  getBookingByGivenIdUseCase,
  getAllBookingsUseCase,
  getBookingsByStatusUseCase,
  cancelBookingsUseCase,
  sendEmailToTourOperator,
  confirmBookingUseCase,
} = useCases;
