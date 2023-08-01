import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logger } from 'core';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createEstimationValidator, updateEstimationValidator } from './utils/validator';
import {
  createEstimationUseCase, deleteEstimationUseCase,
  getEstimationListUseCase,
  getEstimationUseCase,
  updateEstimationUseCase,
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

app.get('/tours/:tourId/estimations', async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const estimations = await getEstimationListUseCase.invoke(currentUser, tourId);
    res.json(wrapResponse(SUCCESS, estimations));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/tours/:tourId/estimations', createEstimationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tourId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const estimation = await createEstimationUseCase.invoke(currentUser, tourId, req.body);
    res.json(wrapResponse(SUCCESS, estimation));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/tours/:tourId/estimations/:estimationId', async (req: Request, res: Response) => {
  try {
    const { tourId, estimationId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const estimation = await getEstimationUseCase.invoke(currentUser, tourId, estimationId);
    res.json(wrapResponse(SUCCESS, estimation));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/tours/:tourId/estimations/:estimationId', updateEstimationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tourId, estimationId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const estimation = await updateEstimationUseCase.invoke(
      currentUser,
      tourId,
      estimationId,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, estimation));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/tours/:tourId/estimations/:estimationId', async (req: Request, res: Response) => {
  try {
    const { tourId, estimationId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deleteEstimationUseCase.invoke(currentUser, tourId, estimationId);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[${req.method.toUpperCase()} ${req.path}] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
