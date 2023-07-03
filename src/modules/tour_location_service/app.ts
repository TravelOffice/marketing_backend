import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import logger from 'core/utils/logger';
import {
  createTourLocationUseCase,
  deleteTourLocationUseCase,
  getTourLocationListUseCase,
  getTourLocationUseCase,
  updateTourLocationUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createUpdateTourLocationValidator } from './utils/validator';

// Create an instance of the Express application
const app = express();

// Middleware for compressing HTTP responses
app.use(compression());

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for setting CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

const prefix = '/tour-locations';

// Middleware for logging incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

// Route for handling GET requests to the root endpoint
app.get(`${prefix}/`, async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const tourLocations = await getTourLocationListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, tourLocations));
  } catch (error: any) {
    logger.log('Error retrieving tour locations:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling POST requests to the root endpoint
app.post(`${prefix}/`, createUpdateTourLocationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const tourLocation = await createTourLocationUseCase.invoke(tenant, req.body);
    res.json(wrapResponse(SUCCESS, tourLocation));
  } catch (error: any) {
    logger.log('Error creating tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling GET requests to a specific tour location endpoint
app.get(`${prefix}/:id`, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const tourLocation = await getTourLocationUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, tourLocation));
  } catch (error: any) {
    logger.log('Error retrieving tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling PUT requests to a specific tour location endpoint
app.put(`${prefix}/:id`, createUpdateTourLocationValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const tourLocation = await updateTourLocationUseCase.invoke(tenant, id, req.body);
    res.json(wrapResponse(SUCCESS, tourLocation));
  } catch (error: any) {
    logger.log('Error updating tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling DELETE requests to a specific tour location endpoint
app.delete(`${prefix}/:id`, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    await deleteTourLocationUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log('Error deleting tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
