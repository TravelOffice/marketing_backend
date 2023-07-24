import compression from 'compression';
import { logger } from 'core';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  getTourPlanUseCase,
  updateTourPlanUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { getTourPlanValidator, updateTourPlanValidator } from './utils/validator';
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

app.get('/tours-operation/plan/:departureTourId', getTourPlanValidator(), async (req: Request, res: Response) => {
  try {
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { tenant } = currentUser;
    const { departureTourId } = req.params;
    const tourPlan = await getTourPlanUseCase.invoke(tenant, departureTourId);
    res.json(wrapResponse(SUCCESS, tourPlan));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while retrieving tour plan on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, error.message));
  }
});

app.put('/tours-operation/plan/:departureTourId', updateTourPlanValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { tenant } = currentUser;
    const { departureTourId } = req.params;
    const { tourPlan } = req.body;
    const updatedTourPlan = await updateTourPlanUseCase.invoke(tenant, departureTourId, tourPlan);
    res.json(wrapResponse(SUCCESS, updatedTourPlan));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while updating tour plan on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, error.message));
  }
});

export default app;
