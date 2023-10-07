// TODO: Declare use cases which can be used in this service here

import { GetTotalLeadOfSaleUseCase } from './interfaces/GetTotalLeadOfSaleUseCase';
import { GetTotalBookingOfSaleUseCase } from './interfaces/GetTotalBookingOfSaleUseCase';
import GetTotalLeadOfSaleUseCaseImpl from './GetTotalLeadOfSaleUseCaseImpl';
import GetTotalBookingOfSaleUseCaseImpl from './GetTotalBookingOfSaleUseCaseImpl';

interface UseCases {
  getTotalLeadOfSaleUserCase: GetTotalLeadOfSaleUseCase,
  getTotalBookingOfSaleUseCase: GetTotalBookingOfSaleUseCase,
}

const useCases: UseCases = {
  getTotalLeadOfSaleUserCase: new GetTotalLeadOfSaleUseCaseImpl(),
  getTotalBookingOfSaleUseCase: new GetTotalBookingOfSaleUseCaseImpl(),
};

export const {
  getTotalLeadOfSaleUserCase,
  getTotalBookingOfSaleUseCase,
} = useCases;
