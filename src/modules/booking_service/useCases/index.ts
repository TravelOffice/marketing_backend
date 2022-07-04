import GetBookingListByLeadUseCaseImpl from './GetBookingListByLeadUseCaseImpl';
import { GetBookingListByLeadUseCase } from './interfaces/GetBookingListByLeadUseCase';

interface UseCases {
  getBookingListByLeadUseCase: GetBookingListByLeadUseCase,
}

const useCases : UseCases = {
  getBookingListByLeadUseCase: new GetBookingListByLeadUseCaseImpl(),
};

export const {
  getBookingListByLeadUseCase,
} = useCases;
