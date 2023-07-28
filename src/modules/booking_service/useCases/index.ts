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
import { AddNoteUseCase } from './interfaces/AddNoteUseCase';
import AddNoteUseCaseImpl from './AddNoteUseCaseImpl';
import { UpdateNoteUseCase } from './interfaces/UpdateNoteUseCase';
import UpdateNoteUseCaseImpl from './UpdateNoteUseCaseImpl';
import DeleteNoteUseCaseImpl from './DeleteNoteUseCaseImpl';
import { DeleteNoteUseCase } from './interfaces/DeleteNoteUseCase';
import { HandlePaymentOverdueUseCase } from './interfaces/HandlePaymentOverdueUseCase';
import { HandlePaymentPendingUseCase } from './interfaces/HandlePaymentPendingUseCase';
import HandlePaymentPendingUseCaseImpl from './HandlePaymentPendingUseCaseImpl';
import HandlePaymentOverdueUseCaseImpl from './HandlePaymentOverdueUseCaseImpl';
import GetBookingsByDepartureTourIdUseCaseImpl from './GetBookingsByDepartureTourIdUseCaseImpl';
import { GetBookingsByDepartureTourIdUseCase } from './interfaces/GetBookingsByDepartureTourIdUseCase';
import { GetEstimationListUseCase } from './interfaces/estimation/GetEstimationListUseCase';
import { CreateEstimationUseCase } from './interfaces/estimation/CreateEstimationUseCase';
import { GetEstimationUseCase } from './interfaces/estimation/GetEstimationUseCase';
import { UpdateEstimationUseCase } from './interfaces/estimation/UpdateEstimationUseCase';
import { DeleteEstimationUseCase } from './interfaces/estimation/DeleteEstimationUseCase';
import GetEstimationListUseCaseImpl from './estimation/GetEstimationListUseCaseImpl';
import CreateEstimationUseCaseImpl from './estimation/CreateEstimationUseCaseImpl';
import GetEstimationUseCaseImpl from './estimation/GetEstimationUseCaseImpl';
import UpdateEstimationUseCaseImpl from './estimation/UpdateEstimationUseCaseImpl';
import DeleteEstimationUseCaseImpl from './estimation/DeleteEstimationUseCaseImpl';

interface UseCases {
  createBookingUseCase: CreateBookingUseCase,
  createBookingFromLeadUseCase: CreateBookingFromLeadUseCase,
  updateBookingUseCase: UpdateBookingUseCase,
  getBookingByGivenIdUseCase: GetBookingByGivenIdUseCase,
  getAllBookingsUseCase: GetAllBookingUseCase,
  getBookingsByStatusUseCase: GetBookingsByStatusUseCase,
  cancelBookingUseCase: CancelBookingUseCase,
  sendEmailToTourOperator: SendEmailToTourOperatorUseCase,
  confirmBookingUseCase: ConfirmBookingUseCase,
  addNoteUseCase: AddNoteUseCase,
  updateNoteUseCase: UpdateNoteUseCase,
  deleteNoteUseCase: DeleteNoteUseCase,
  getBookingsByDepartureTourIdUseCase: GetBookingsByDepartureTourIdUseCase,
  handlePaymentPendingUseCase: HandlePaymentPendingUseCase,
  handlePaymentOverdueUseCase: HandlePaymentOverdueUseCase,
  getEstimationListUseCase: GetEstimationListUseCase,
  createEstimationUseCase: CreateEstimationUseCase,
  getEstimationUseCase: GetEstimationUseCase,
  updateEstimationUseCase: UpdateEstimationUseCase,
  deleteEstimationUseCase: DeleteEstimationUseCase,
}

const useCases: UseCases = {
  createBookingUseCase: new CreateBookingUseCaseImpl(),
  createBookingFromLeadUseCase: new CreateBookingFromLeadUseCaseImpl(),
  updateBookingUseCase: new UpdateBookingUseCaseImpl(),
  getBookingByGivenIdUseCase: new GetBookingByGivenIdUseCaseImpl(),
  getAllBookingsUseCase: new GetAllBookingUseCaseImpl(),
  getBookingsByStatusUseCase: new GetBookingsByStatusUseCaseImpl(),
  cancelBookingUseCase: new CancelBookingUseCaseImpl(),
  sendEmailToTourOperator: new SendEmailToTourOperatorImpl(),
  confirmBookingUseCase: new ConfirmBookingUseCaseImpl(),
  addNoteUseCase: new AddNoteUseCaseImpl(),
  updateNoteUseCase: new UpdateNoteUseCaseImpl(),
  deleteNoteUseCase: new DeleteNoteUseCaseImpl(),
  handlePaymentPendingUseCase: new HandlePaymentPendingUseCaseImpl(),
  handlePaymentOverdueUseCase: new HandlePaymentOverdueUseCaseImpl(),
  getBookingsByDepartureTourIdUseCase: new GetBookingsByDepartureTourIdUseCaseImpl(),
  getEstimationListUseCase: new GetEstimationListUseCaseImpl(),
  createEstimationUseCase: new CreateEstimationUseCaseImpl(),
  getEstimationUseCase: new GetEstimationUseCaseImpl(),
  updateEstimationUseCase: new UpdateEstimationUseCaseImpl(),
  deleteEstimationUseCase: new DeleteEstimationUseCaseImpl(),
};

export const {
  createBookingUseCase,
  createBookingFromLeadUseCase,
  updateBookingUseCase,
  getBookingByGivenIdUseCase,
  getAllBookingsUseCase,
  getBookingsByStatusUseCase,
  cancelBookingUseCase,
  sendEmailToTourOperator,
  confirmBookingUseCase,
  addNoteUseCase,
  updateNoteUseCase,
  deleteNoteUseCase,
  handlePaymentPendingUseCase,
  handlePaymentOverdueUseCase,
  getBookingsByDepartureTourIdUseCase,
  getEstimationListUseCase,
  createEstimationUseCase,
  getEstimationUseCase,
  updateEstimationUseCase,
  deleteEstimationUseCase,
} = useCases;
