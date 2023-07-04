import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import logger from 'core/utils/logger';
import {
  createReceiptUseCase,
  deleteReceiptUseCase,
  getReceiptListUseCase,
  getReceiptUseCase,
  updateReceiptUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import { CognitoUser } from './models/CognitoUser';

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

// Middleware for logging incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

// Route for handling GET requests to the root endpoint
app.get('/receipts', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const receipts = await getReceiptListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, receipts));
  } catch (error: any) {
    logger.log('Error retrieving tour locations:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling POST requests to the root endpoint
app.post('/receipts', async (req: Request, res: Response) => {
  try {
    // validate(req);
    const userInfo = getCurrentUserInfo(req.headers.authorization!);
    const receipt = await createReceiptUseCase.invoke(userInfo as CognitoUser, req.body);
    res.json(wrapResponse(SUCCESS, receipt));
  } catch (error: any) {
    logger.log('Error creating tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling GET requests to a specific tour location endpoint
app.get('receipts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const receipt = await getReceiptUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, receipt));
  } catch (error: any) {
    logger.log('Error retrieving tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling PUT requests to a specific tour location endpoint
app.put('/receipts/:id', async (req: Request, res: Response) => {
  try {
    // validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const receipt = await updateReceiptUseCase.invoke(tenant, id, req.body);
    res.json(wrapResponse(SUCCESS, receipt));
  } catch (error: any) {
    logger.log('Error updating tour location:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling DELETE requests to a specific tour location endpoint
app.delete('/receipts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    await deleteReceiptUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log('Error deleting receipt:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
