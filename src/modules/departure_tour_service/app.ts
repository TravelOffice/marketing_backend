import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import {
  changeAssigneeUseCase,
  changeOperationStatusUseCase,
  createDepartureTourUseCase,
  deleteDepartureTourUseCase,
  getDepartureTourListUseCase,
  getDepartureTourUseCase,
  updateDepartureTourUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { changeOperatorStatusValidator, createOrUpdateDepartureTourValidator } from './utils/validator';
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

app.get('/departure-tours', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTours = await getDepartureTourListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, departureTours));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while retrieving departure tours on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/departure-tours', createOrUpdateDepartureTourValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username, name } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    req.body.creatorId = username;
    req.body.creatorName = name;
    const departureTour = await createDepartureTourUseCase.invoke(tenant, req.body);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while creating/updating departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/departure-tours/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTour = await getDepartureTourUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while retrieving departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/departure-tours/:id', createOrUpdateDepartureTourValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTour = await updateDepartureTourUseCase.invoke(tenant, id, req.body);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while updating departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/departure-tours/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const ret = await deleteDepartureTourUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, ret));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while deleting departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/departure-tours/:id/assignee', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { assigneeId } = req.body;
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTour = await changeAssigneeUseCase.invoke(tenant, id, assigneeId);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while changing assignee of departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/me/take-care-tour', async (req: Request, res: Response) => {
  try {
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const { departureTourId } = req.body;
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTour = await changeAssigneeUseCase.invoke(tenant, departureTourId, username);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while taking care departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/departure-tours/:id/operation-status', changeOperatorStatusValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { operationStatus } = req.body;
    logger.log(`[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`);
    const departureTour = await changeOperationStatusUseCase.invoke(tenant, id, operationStatus);
    res.json(wrapResponse(SUCCESS, departureTour));
  } catch (error: any) {
    logger.log(`[${req.method}] An error occurred while updating departure tour on route '${req.originalUrl}':`, error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
