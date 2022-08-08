import { ChatPlatform } from 'common-models';
import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  createTenantUserUseCase,
  deleteTenantUserUseCase,
  getLinkedPageUseCase,
  getTenantUserListUseCase,
  getTenantUserUseCase,
  getTenantUserWithPermissionUseCase,
  unlinkPageUsecase,
  updateTenantUserUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { createTenantUserValidator, unlinkPageValidator, updateTenantUserValidator } from './utils/validator';
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
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const users = await getTenantUserListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, users));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/users', createTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const user = await createTenantUserUseCase.invoke(tenant, req.body);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const user = await getTenantUserUseCase.invoke(tenant, userId);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/me', async (req: Request, res: Response) => {
  try {
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const user = await getTenantUserWithPermissionUseCase.invoke(tenant, username);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/users/:userId', updateTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { userId } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const user = await updateTenantUserUseCase.invoke(tenant, userId, req.body);
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[app.put] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/me', updateTenantUserValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const user = await updateTenantUserUseCase.invoke(
      tenant,
      username,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, user));
  } catch (error: any) {
    logger.log(`[PUT /me] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/users/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    await deleteTenantUserUseCase.invoke(tenant, userId);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[DELETE /users/:userId] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/admin/linked_pages', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const pages = await getLinkedPageUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, pages));
  } catch (error:any) {
    logger.log(`[GET /me/linked_pages] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/admin/linked_pages', unlinkPageValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { platform, pageId } = req.query;
    await unlinkPageUsecase.invoke(tenant, platform as ChatPlatform, pageId as string);
    res.json(wrapResponse(SUCCESS, undefined));
  } catch (error:any) {
    logger.log(`[DELETE /me/linked_pages] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
