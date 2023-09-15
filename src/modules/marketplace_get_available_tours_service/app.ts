import compression from 'compression';
import cors from 'cors';
import { getMarketplaceUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { getEnv } from 'get-env';
import { FAILED, SUCCESS } from './utils/constants';
import invokeFunction from './utils/lambda';
import logger from './utils/logger';
import wrapResponse from './utils/wrapResponse';

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

app.get('/marketplace/available-leads', async (req: Request, res: Response) => {
  try {
    const paginationParams = req.query;
    const {
      tenant: organization,
      username: fromUser,
    } = getMarketplaceUserInfo(req.headers.authorization!);
    const invokeParams = {
      FunctionName: getEnv('LEAD_SERVICE_NAME'),
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify({
        organization,
        fromUser,
        paginationParams,
      }),
    };
    const data = await invokeFunction(invokeParams);
    logger.log(`[GET] Get available leads Successfully ${data}`);
    res.json(wrapResponse(SUCCESS, data));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/available-tour-templates', async (req: Request, res: Response) => {
  try {
    const paginationParams = req.query;
    const {
      tenant: organization,
      username: fromUser,
    } = getMarketplaceUserInfo(req.headers.authorization!);
    const invokeParams = {
      FunctionName: getEnv('TOUR_TEMPLATE_SERVICE_NAME'),
      InvocationType: 'RequestResponse',
      LogType: 'Tail',
      Payload: JSON.stringify({
        organization,
        fromUser,
        paginationParams,
      }),
    };
    const data = await invokeFunction(invokeParams);
    logger.log(`[GET] Get available tour templates Successfully ${data}`);
    res.json(wrapResponse(SUCCESS, data));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
