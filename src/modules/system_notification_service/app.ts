import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { storeUserSessionUseCase } from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { createUserDeviceSession } from './utils/validator';
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

app.get('/notification/sessions/:token', async (req: Request, res: Response) => {
  try {
    throw new Error('Not implemented');
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/notification/sessions', async (req: Request, res: Response) => {
  try {
    throw new Error('Not implemented');
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/notification/sessions', createUserDeviceSession(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const session = await storeUserSessionUseCase.invoke(currentUser, req.body);
    res.json(wrapResponse(SUCCESS, session));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/notification/sessions/:token', async (req: Request, res: Response) => {
  try {
    throw new Error('Not implemented');
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
