import GetBookingListByLeadUseCaseImpl from './GetBookingListByLeadUseCaseImpl';
import CreateBookingUseCaseImpl from './CreateBookingUseCaseImpl';
import { CreateBookingUseCase } from './interfaces/CreateBookingUseCase';
import { GetBookingListByLeadUseCase } from './interfaces/GetBookingListByLeadUseCase';

interface UseCases {
  getBookingListByLeadUseCase: GetBookingListByLeadUseCase,
  createBookingUseCase: CreateBookingUseCase,
}

const useCases : UseCases = {
  getBookingListByLeadUseCase: new GetBookingListByLeadUseCaseImpl(),
  createBookingUseCase: new CreateBookingUseCaseImpl(),
};

export const {
  getBookingListByLeadUseCase,
  createBookingUseCase,
} = useCases;
