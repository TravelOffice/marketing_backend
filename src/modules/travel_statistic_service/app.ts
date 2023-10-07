import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';

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

app.get('/statistic', async (req: Request, res: Response) => {
  try {
    logger.log('[GET] Get statistic Successfully');
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
