import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logger } from 'core';
import {
  createOrganizationUseCase,
  deleteOrganizationUseCase,
  getOrganizationListUseCase,
  getOrganizationUseCase,
  updateOrganizationUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createOrUpdateOrganizationValidator } from './utils/validator';

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

app.get('/marketplace/organizations', async (req: Request, res: Response) => {
  try {
    const organizations = await getOrganizationListUseCase.invoke();
    res.json(wrapResponse(SUCCESS, organizations));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/organizations', createOrUpdateOrganizationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const organization = await createOrganizationUseCase.invoke(currentUser, req.body);
    res.json(wrapResponse(SUCCESS, organization));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/organizations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const organization = await getOrganizationUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, organization));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/organizations/:id', createOrUpdateOrganizationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const organization = await updateOrganizationUseCase.invoke(currentUser, id, req.body);
    res.json(wrapResponse(SUCCESS, organization));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/organizations/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deleteOrganizationUseCase.invoke(currentUser, id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
