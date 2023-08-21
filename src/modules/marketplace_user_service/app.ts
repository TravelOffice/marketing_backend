import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  createMarketplaceUserUseCase,
  enableMarketplaceUserUseCase,
  getMarketplaceUserUseCase,
  getTenantUserListUseCase,
  updateMarketplaceUserUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import wrapResponse from './utils/wrapResponse';
import validate, { createUserValidator, enableUserValidator, updateUserValidator } from './utils/validator';

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

app.get('/marketplace/users', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const users = await getTenantUserListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/users', createUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { roles, tenant, username } = req.body;
    const users = await createMarketplaceUserUseCase.invoke(tenant, username, roles);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/me', updateUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const users = await updateMarketplaceUserUseCase.invoke(tenant, username, req.body);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/enable-user', enableUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { userId, enable } = req.body;
    const users = await enableMarketplaceUserUseCase.invoke(userId, enable);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me', async (req: Request, res: Response) => {
  try {
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const id = `${tenant}#${username}`;
    const currentUser = await getMarketplaceUserUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, currentUser));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/users/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = await getMarketplaceUserUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, currentUser));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
