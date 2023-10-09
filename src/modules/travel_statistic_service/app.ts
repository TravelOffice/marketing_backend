import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { getStatisticValidator } from './utils/validator';
import { MetricName } from './models/MetricName';
import {
  getConversionRatioUseCase,
  getTotalBookingOfSaleUseCase,
  getTotalLeadOfSaleUserCase,
  getTotalProfitOfTenantUseCase,
  getTotalRevenueOfTenantUseCase,
} from './useCases';

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
      case 'totalRevenueOfTenant':
        result = await getTotalRevenueOfTenantUseCase.invoke(tenant, filteringDuration);
        break;
      case 'totalProfitOfTenant':
        result = await getTotalProfitOfTenantUseCase.invoke(tenant, filteringDuration);
        break;
      case 'conversionRatioOfTenant':
        result = await getConversionRatioUseCase.invoke(tenant, filteringDuration);
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

export default app;
