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

interface UseCases {
  createBookingUseCase: CreateBookingUseCase,
  getBookingByGivenIdUseCase: GetBookingByGivenIdUseCase,
  getAllBookingsUseCase: GetAllBookingUseCase,
  getBookingsByStatusUseCase: GetBookingsByStatusUseCase,
  cancelBookingsUseCase: CancelBookingUseCase,
}

const useCases: UseCases = {
  createBookingUseCase: new CreateBookingUseCaseImpl(),
  getBookingByGivenIdUseCase: new GetBookingByGivenIdUseCaseImpl(),
  getAllBookingsUseCase: new GetAllBookingUseCaseImpl(),
  getBookingsByStatusUseCase: new GetBookingsByStatusUseCaseImpl(),
  cancelBookingsUseCase: new CancelBookingUseCaseImpl(),
};

export const {
  createBookingUseCase,
  getBookingByGivenIdUseCase,
  getAllBookingsUseCase,
  getBookingsByStatusUseCase,
  cancelBookingsUseCase,
} = useCases;
