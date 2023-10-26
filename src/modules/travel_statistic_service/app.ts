import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { getSessionStatisticValidator, getStatisticValidator } from './utils/validator';
import { MetricName } from './models/MetricName';
import {
  getConversionRatioOfTenantUseCase,
  getConversionRatiosOfSaleUseCase,
  getOrgTotalSessionByConversationUseCase,
  getOrgTotalSessionByDurationUseCase,
  getOrgTotalSessionByStatusUseCase,
  getTopFavouriteLocationUseCase,
  getTopFavouriteTourUseCase,
  getTopProficiencyTourUseCase,
  getTotalBookingOfSaleUseCase,
  getTotalLeadOfSaleUserCase,
  getTotalProfitOfTenantUseCase,
  getTotalRevenueOfSaleUseCase,
  getTotalRevenueOfTenantUseCase,
  getOrgTotalSessionUseCase,
  getUserTotalSessionUseCase,
  getTourFillingRatioUseCase,
  getUserTotalSessionByConversationUseCase,
  getUserTotalSessionByDurationUseCase,
  getUserTotalSessionByStatusUseCase,
  getOrgAverageResponseTimeUseCase,
  getUserAverageResponseTimeUseCase,
  getOrgResponseByConditionTimeUseCase,
  getUserResponseByConditionTimeUseCase,
  getLeadChatConversionRatioUseCase,
} from './useCases';
import { Condition, SessionMetric, SessionStatus } from './models/ChatSessionStatistic';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

app.get('/statistic/tenant', getStatisticValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const {
      metricName, startTime, endTime, topCount, limit, nextToken,
    } = req.query;
    let result;
    let filteringDuration;
    if (startTime && endTime) {
      filteringDuration = {
        startTime: startTime as string,
        endTime: endTime as string,
      };
    }
    switch (metricName as MetricName) {
      case 'totalRevenueOfTenant':
        result = await getTotalRevenueOfTenantUseCase.invoke(tenant, filteringDuration);
        break;
      case 'totalProfitOfTenant':
        result = await getTotalProfitOfTenantUseCase.invoke(tenant, filteringDuration);
        break;
      case 'conversionRatioOfTenant':
        result = await getConversionRatioOfTenantUseCase.invoke(tenant, filteringDuration);
        break;
      case 'topProficiencyTour':
        result = await getTopProficiencyTourUseCase.invoke(
          tenant,
          filteringDuration,
          Number(topCount),
        );
        break;
      case 'topFavouriteTour':
        result = await getTopFavouriteTourUseCase.invoke(
          tenant,
          filteringDuration,
          Number(topCount),
        );
        break;
      case 'topFavouriteLocation':
        result = await getTopFavouriteLocationUseCase.invoke(
          tenant,
          filteringDuration,
          Number(topCount),
        );
        break;
      case 'tourFillingRatio':
        result = await getTourFillingRatioUseCase.invoke(
          tenant,
          {
            nextToken: nextToken as string,
            limit: Number(limit),
            sortType: 'ASC',
          },
        );
        break;
      case 'leadChatConversionRatio':
        result = await getLeadChatConversionRatioUseCase.invoke(tenant, filteringDuration);
        break;
      default:
        break;
    }
    logger.log(`[GET] Get statistic ${metricName} Successfully`);
    res.json(wrapResponse(SUCCESS, result));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/statistic/sales/:id', getStatisticValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { id: saleId } = req.params;
    const { metricName, startTime, endTime } = req.query;
    let result;
    let filteringDuration;
    if (startTime && endTime) {
      filteringDuration = {
        startTime: startTime as string,
        endTime: endTime as string,
      };
    }
    switch (metricName as MetricName) {
      case 'totalLeadOfSale':
        result = await getTotalLeadOfSaleUserCase.invoke(tenant, saleId, filteringDuration);
        break;
      case 'totalBookingOfSale':
        result = await getTotalBookingOfSaleUseCase.invoke(tenant, saleId, filteringDuration);
        break;
      case 'totalRevenueOfSale':
        result = await getTotalRevenueOfSaleUseCase.invoke(tenant, saleId, filteringDuration);
        break;
      case 'conversionRatioOfSale':
        result = await getConversionRatiosOfSaleUseCase.invoke(tenant, saleId, filteringDuration);
        break;
      default:
        break;
    }
    logger.log(`[GET] Get statistic ${metricName} Successfully`);
    res.json(wrapResponse(SUCCESS, result));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/statistic/chat-sessions', getSessionStatisticValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const {
      metricName: sessionMetric,
      conversationId,
      status,
      duration,
      startTime,
      comparasionTime,
      condition,
    } = req.query;
    let result;
    switch (sessionMetric as SessionMetric) {
      case SessionMetric.TOTAL:
        result = await getOrgTotalSessionUseCase.invoke(tenant);
        break;
      case SessionMetric.TOTAL_BY_CONVERSATION:
        result = await getOrgTotalSessionByConversationUseCase
          .invoke(tenant, conversationId as string);
        break;
      case SessionMetric.TOTAL_BY_STATUS:
        result = await getOrgTotalSessionByStatusUseCase
          .invoke(tenant, status as SessionStatus);
        break;
      case SessionMetric.TOTAL_BY_DURATION:
        result = await getOrgTotalSessionByDurationUseCase
          .invoke(tenant, Number(duration));
        break;
      case SessionMetric.AVERAGE_RESPONSE_TIME:
        result = await getOrgAverageResponseTimeUseCase
          .invoke(tenant, startTime as string);
        break;
      case SessionMetric.TOTAL_RESPONSE_TIME_BY_CONDITION:
        result = await getOrgResponseByConditionTimeUseCase
          .invoke(
            tenant,
            {
              comparasionTime: Number(comparasionTime),
              condition: condition as Condition,
            },
            startTime as string,
          );
        break;
      default:
        break;
    }
    logger.log(`[GET] Get session statistic ${sessionMetric} Successfully`);
    res.json(wrapResponse(SUCCESS, result));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/statistic/:username/chat-sessions', getSessionStatisticValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { username } = req.params;
    const {
      metricName: sessionMetric,
      conversationId,
      status,
      duration,
      startTime,
      comparasionTime,
      condition,
    } = req.query;
    let result;
    switch (sessionMetric as SessionMetric) {
      case SessionMetric.TOTAL:
        result = await getUserTotalSessionUseCase.invoke(tenant, username);
        break;
      case SessionMetric.TOTAL_BY_CONVERSATION:
        result = await getUserTotalSessionByConversationUseCase
          .invoke(tenant, username, conversationId as string);
        break;
      case SessionMetric.TOTAL_BY_STATUS:
        result = await getUserTotalSessionByStatusUseCase
          .invoke(tenant, username, status as SessionStatus);
        break;
      case SessionMetric.TOTAL_BY_DURATION:
        result = await getUserTotalSessionByDurationUseCase
          .invoke(tenant, username, Number(duration));
        break;
      case SessionMetric.AVERAGE_RESPONSE_TIME:
        result = await getUserAverageResponseTimeUseCase
          .invoke(tenant, username, startTime as string);
        break;
      case SessionMetric.TOTAL_RESPONSE_TIME_BY_CONDITION:
        result = await getUserResponseByConditionTimeUseCase
          .invoke(
            tenant,
            username,
            {
              comparasionTime: Number(comparasionTime),
              condition: condition as Condition,
            },
            startTime as string,
          );
        break;
      default:
        break;
    }
    logger.log(`[GET] Get session statistic ${sessionMetric} Successfully`);
    res.json(wrapResponse(SUCCESS, result));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
