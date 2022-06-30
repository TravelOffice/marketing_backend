import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  createTenantUserUseCase,
  deleteTenantUserUseCase,
  getTenantUserListUseCase,
  getTenantUserUseCase,
  updateTenantUserUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { createTenantUserValidator, updateTenantUserValidator } from './utils/validator';
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

app.get('/users', async (req: Request, res: Response) => {
  try {
    const { username: authenticatedUserName } = getCurrentUserInfo(req.headers.authorization!);
    const users = await getTenantUserListUseCase.invoke(authenticatedUserName);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/users', createTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const {
      username: authenticatedUserName,
    } = getCurrentUserInfo(req.headers.authorization!);

    const user = await createTenantUserUseCase.invoke(authenticatedUserName, req.body);

    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.post] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await getTenantUserUseCase.invoke(userId);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.get] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/me', async (req: Request, res: Response) => {
  try {
    const { username: authenticatedUserName } = getCurrentUserInfo(req.headers.authorization!);
    const user = await getTenantUserUseCase.invoke(authenticatedUserName);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.get] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/users/:userId', updateTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { userId } = req.params;
    const { username: authenticatedUserName } = getCurrentUserInfo(req.headers.authorization!);

    const user = await updateTenantUserUseCase.invoke(authenticatedUserName, userId, req.body);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.put] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/me', updateTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { username: authenticatedUserName } = getCurrentUserInfo(req.headers.authorization!);

    const user = await updateTenantUserUseCase.invoke(
      authenticatedUserName,
      authenticatedUserName,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.put] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username: authenticatedUserName } = getCurrentUserInfo(req.headers.authorization!);
    await deleteTenantUserUseCase.invoke(authenticatedUserName, userId);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[app.delete] Error' ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
