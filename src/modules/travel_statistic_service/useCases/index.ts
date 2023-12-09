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
import { GetOrgTotalSessionUseCase } from './interfaces/GetOrgTotalSessionUseCase';
import GetOrgTotalSessionUseCaseImpl from './GetOrgTotalSessionUseCaseImpl';
import { GetOrgTotalSessionByConversationUseCase } from './interfaces/GetOrgTotalSessionByConversationUseCase';
import GetOrgTotalSessionByConversationUseCaseImpl from './GetOrgTotalSessionByConversationUseCaseImpl';
import { GetOrgTotalSessionByStatusUseCase } from './interfaces/GetOrgTotalSessionByStatusUseCase';
import GetOrgTotalSessionByStatusUseCaseImpl from './GetOrgTotalSessionByStatusUseCaseImpl';
import { GetOrgTotalSessionByDurationUseCase } from './interfaces/GetOrgTotalSessionByDurationUseCase';
import GetOrgTotalSessionByDurationUseCaseImpl from './GetOrgTotalSessionByDurationUseCaseImpl';
import { GetUserTotalSessionUseCase } from './interfaces/GetUserTotalSessionUseCase';
import GetUserTotalSessionUseCaseImpl from './GetUserTotalSessionUseCaseImpl';
import { GetUserTotalSessionByConversationUseCase } from './interfaces/GetUserTotalSessionByConversationUseCase';
import GetUserTotalSessionByConversationUseCaseImpl from './GetUserTotalSessionByConversationUseCaseImpl';
import { GetUserTotalSessionByDurationUseCase } from './interfaces/GetUserTotalSessionByDurationUseCase';
import GetUserTotalSessionByDurationUseCaseImpl from './GetUserTotalSessionByDurationUseCaseImpl';
import { GetUserTotalSessionByStatusUseCase } from './interfaces/GetUserTotalSessionByStatusUseCase';
import GetUserTotalSessionByStatusUseCaseImpl from './GetUserTotalSessionByStatusUseCaseImpl';
import { GetOrgAverageResponseTimeUseCase } from './interfaces/GetOrgAverageResponseTimeUseCase';
import GetOrgAverageResponseTimeUseCaseImpl from './GetOrgAverageResponseTimeUseCaseImpl';
import { GetUserAverageResponseTimeUseCase } from './interfaces/GetUserAverageResponseTimeUseCase';
import GetUserAverageResponseTimeUseCaseImpl from './GetUserAverageResponseTimeUseCaseImpl';
import { GetOrgResponseByConditionTimeUseCase } from './interfaces/GetOrgResponseByConditionTimeUseCase';
import GetOrgResponseByConditionTimeUseCaseImpl from './GetOrgResponseByConditionTimeUseCaseImpl';
import { GetUserResponseByConditionTimeUseCase } from './interfaces/GetUserResponseByConditionTimeUseCase';
import GetUserResponseByConditionTimeUseCaseImpl from './GetUserResponseByConditionTimeUseCaseImpl';
import { GetLeadChatConversionRatioUseCase } from './interfaces/GetLeadChatConversionRatioUseCase';
import GetLeadChatConversionRatioUseCaseImpl from './GetLeadChatConversionRatioUseCaseImpl';
import { GetSessionPlatformStatisticUseCase } from './interfaces/GetSessionPlatformStatisticUseCase';
import GetSessionPlatformStatisticUseCaseImpl from './GetSessionPlatformStatisticUseCaseImpl';

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
  getOrgTotalSessionUseCase: GetOrgTotalSessionUseCase;
  getOrgTotalSessionByConversationUseCase: GetOrgTotalSessionByConversationUseCase;
  getOrgTotalSessionByStatusUseCase: GetOrgTotalSessionByStatusUseCase;
  getOrgTotalSessionByDurationUseCase: GetOrgTotalSessionByDurationUseCase;
  getUserTotalSessionUseCase: GetUserTotalSessionUseCase;
  getUserTotalSessionByConversationUseCase: GetUserTotalSessionByConversationUseCase;
  getUserTotalSessionByDurationUseCase: GetUserTotalSessionByDurationUseCase;
  getUserTotalSessionByStatusUseCase: GetUserTotalSessionByStatusUseCase;
  getOrgAverageResponseTimeUseCase: GetOrgAverageResponseTimeUseCase;
  getUserAverageResponseTimeUseCase: GetUserAverageResponseTimeUseCase;
  getOrgResponseByConditionTimeUseCase: GetOrgResponseByConditionTimeUseCase;
  getUserResponseByConditionTimeUseCase: GetUserResponseByConditionTimeUseCase;
  getLeadChatConversionRatioUseCase: GetLeadChatConversionRatioUseCase;
  getSessionPlatformStatisticUseCase: GetSessionPlatformStatisticUseCase;
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
  getOrgTotalSessionUseCase: new GetOrgTotalSessionUseCaseImpl(),
  getOrgTotalSessionByConversationUseCase: new GetOrgTotalSessionByConversationUseCaseImpl(),
  getOrgTotalSessionByStatusUseCase: new GetOrgTotalSessionByStatusUseCaseImpl(),
  getOrgTotalSessionByDurationUseCase: new GetOrgTotalSessionByDurationUseCaseImpl(),
  getUserTotalSessionUseCase: new GetUserTotalSessionUseCaseImpl(),
  getUserTotalSessionByConversationUseCase: new GetUserTotalSessionByConversationUseCaseImpl(),
  getUserTotalSessionByDurationUseCase: new GetUserTotalSessionByDurationUseCaseImpl(),
  getUserTotalSessionByStatusUseCase: new GetUserTotalSessionByStatusUseCaseImpl(),
  getOrgAverageResponseTimeUseCase: new GetOrgAverageResponseTimeUseCaseImpl(),
  getUserAverageResponseTimeUseCase: new GetUserAverageResponseTimeUseCaseImpl(),
  getOrgResponseByConditionTimeUseCase: new GetOrgResponseByConditionTimeUseCaseImpl(),
  getUserResponseByConditionTimeUseCase: new GetUserResponseByConditionTimeUseCaseImpl(),
  getLeadChatConversionRatioUseCase: new GetLeadChatConversionRatioUseCaseImpl(),
  getSessionPlatformStatisticUseCase: new GetSessionPlatformStatisticUseCaseImpl(),
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
  getOrgTotalSessionUseCase,
  getOrgTotalSessionByConversationUseCase,
  getOrgTotalSessionByStatusUseCase,
  getOrgTotalSessionByDurationUseCase,
  getUserTotalSessionUseCase,
  getUserTotalSessionByConversationUseCase,
  getUserTotalSessionByDurationUseCase,
  getUserTotalSessionByStatusUseCase,
  getOrgAverageResponseTimeUseCase,
  getUserAverageResponseTimeUseCase,
  getOrgResponseByConditionTimeUseCase,
  getUserResponseByConditionTimeUseCase,
  getLeadChatConversionRatioUseCase,
  getSessionPlatformStatisticUseCase,
} = useCases;
