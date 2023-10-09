// TODO: Declare use cases which can be used in this service here

import { GetTotalLeadOfSaleUseCase } from './interfaces/GetTotalLeadOfSaleUseCase';
import { GetTotalBookingOfSaleUseCase } from './interfaces/GetTotalBookingOfSaleUseCase';
import GetTotalLeadOfSaleUseCaseImpl from './GetTotalLeadOfSaleUseCaseImpl';
import GetTotalBookingOfSaleUseCaseImpl from './GetTotalBookingOfSaleUseCaseImpl';
import { GetTotalRevenueOfTenantUseCase } from './interfaces/GetTotalRevenueOfTenantUseCase';
import GetTotalRevenueOfTenantUseCaseImpl from './GetTotalRevenueOfTenantUseCaseImpl';
import GetTotalProfitOfTenantUseCaseImpl from './GetTotalProfitOfTenantUseCaseImpl';
import { GetTotalProfitOfTenantUseCase } from './interfaces/GetTotalProfitOfTenantUseCase';
import { GetConversionRatioOfTenantUseCase } from './interfaces/GetConversionRatioOfTenantUseCase';
import GetConversionRatioOfTenantUseCaseImpl from './GetConversionRatioOfTenantUseCaseImpl';

interface UseCases {
  getTotalLeadOfSaleUserCase: GetTotalLeadOfSaleUseCase,
  getTotalBookingOfSaleUseCase: GetTotalBookingOfSaleUseCase,
  getTotalRevenueOfTenantUseCase: GetTotalRevenueOfTenantUseCase,
  getTotalProfitOfTenantUseCase: GetTotalProfitOfTenantUseCase,
  getConversionRatioUseCase: GetConversionRatioOfTenantUseCase,
}

const useCases: UseCases = {
  getTotalLeadOfSaleUserCase: new GetTotalLeadOfSaleUseCaseImpl(),
  getTotalBookingOfSaleUseCase: new GetTotalBookingOfSaleUseCaseImpl(),
  getTotalRevenueOfTenantUseCase: new GetTotalRevenueOfTenantUseCaseImpl(),
  getTotalProfitOfTenantUseCase: new GetTotalProfitOfTenantUseCaseImpl(),
  getConversionRatioUseCase: new GetConversionRatioOfTenantUseCaseImpl(),
};

export const {
  getTotalLeadOfSaleUserCase,
  getTotalBookingOfSaleUseCase,
  getTotalRevenueOfTenantUseCase,
  getTotalProfitOfTenantUseCase,
  getConversionRatioUseCase,
} = useCases;
