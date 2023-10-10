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
import { GetTopProficiencyTourUseCase } from './interfaces/GetTopProficiencyTourUseCase';
import GetTopProficiencyTourUseCaseImpl from './GetTopProficiencyTourUseCaseImpl';
import { GetTopFavouriteLocationUseCase } from './interfaces/GetTopFavouriteLocationUseCase';
import GetTopFavouriteLocationUseCaseImpl from './GetTopFavouriteLocationUseCaseImpl';
import { GetTopFavouriteTourUseCase } from './interfaces/GetTopFavouriteTourUseCase';
import GetTopFavouriteTourUseCaseImpl from './GetTopFavouriteTourUseCaseImpl';
import { GetTotalRevenueOfSaleUseCase } from './interfaces/GetTotalRevenueOfSaleUseCase';
import GetTotalRevenueOfSaleUseCaseImpl from './GetTotalRevenueOfSaleUseCaseImpl';
import { GetConversionRatioOfSaleUseCase } from './interfaces/GetConversionRatioOfSaleUseCase';
import GetConversionRatioOfSaleUseCaseImpl from './GetConversionRatioOfSaleUseCaseImpl';
import { GetTourFillingRatioUseCase } from './interfaces/GetTourFillingRatioUseCase';
import GetTourFillingRatioUseCaseImpl from './GetTourFillingRatioUseCaseImpl';

interface UseCases {
  getTotalLeadOfSaleUserCase: GetTotalLeadOfSaleUseCase,
  getTotalBookingOfSaleUseCase: GetTotalBookingOfSaleUseCase,
  getTotalRevenueOfSaleUseCase: GetTotalRevenueOfSaleUseCase,
  getConversionRatiosOfSaleUseCase: GetConversionRatioOfSaleUseCase,
  getTotalRevenueOfTenantUseCase: GetTotalRevenueOfTenantUseCase,
  getTotalProfitOfTenantUseCase: GetTotalProfitOfTenantUseCase,
  getConversionRatioOfTenantUseCase: GetConversionRatioOfTenantUseCase,
  getTopProficiencyTourUseCase: GetTopProficiencyTourUseCase,
  getTopFavouriteTourUseCase: GetTopFavouriteTourUseCase,
  getTopFavouriteLocationUseCase: GetTopFavouriteLocationUseCase,
  getTourFillingRatioUseCase: GetTourFillingRatioUseCase,
}

const useCases: UseCases = {
  getTotalLeadOfSaleUserCase: new GetTotalLeadOfSaleUseCaseImpl(),
  getTotalBookingOfSaleUseCase: new GetTotalBookingOfSaleUseCaseImpl(),
  getTotalRevenueOfSaleUseCase: new GetTotalRevenueOfSaleUseCaseImpl(),
  getConversionRatiosOfSaleUseCase: new GetConversionRatioOfSaleUseCaseImpl(),
  getTotalRevenueOfTenantUseCase: new GetTotalRevenueOfTenantUseCaseImpl(),
  getTotalProfitOfTenantUseCase: new GetTotalProfitOfTenantUseCaseImpl(),
  getConversionRatioOfTenantUseCase: new GetConversionRatioOfTenantUseCaseImpl(),
  getTopProficiencyTourUseCase: new GetTopProficiencyTourUseCaseImpl(),
  getTopFavouriteTourUseCase: new GetTopFavouriteTourUseCaseImpl(),
  getTopFavouriteLocationUseCase: new GetTopFavouriteLocationUseCaseImpl(),
  getTourFillingRatioUseCase: new GetTourFillingRatioUseCaseImpl(),
};

export const {
  getTotalLeadOfSaleUserCase,
  getTotalBookingOfSaleUseCase,
  getTotalRevenueOfSaleUseCase,
  getConversionRatiosOfSaleUseCase,
  getTotalRevenueOfTenantUseCase,
  getTotalProfitOfTenantUseCase,
  getConversionRatioOfTenantUseCase,
  getTopProficiencyTourUseCase,
  getTopFavouriteTourUseCase,
  getTopFavouriteLocationUseCase,
  getTourFillingRatioUseCase,
} = useCases;
