import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  createTourPostUseCase,
  getTourPostListUseCase,
  getTourPostUseCase,
  updateTourPostUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createTourPostValidator, getPostsValidator, updateTourPostValidator } from './utils/validator';
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

app.get('/marketplace/posts', getPostsValidator(), async (req: Request, res: Response) => {
  try {
    const { nextToken, limit } = req.query;
    const tourPosts = await getTourPostListUseCase.invoke(
      nextToken as string,
      parseInt(limit as string, 10),
    );
    res.json(wrapResponse(SUCCESS, tourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const tourPost = await getTourPostUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts', createTourPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const tourPost = await createTourPostUseCase.invoke(currentUser, req.body);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/posts/:id', updateTourPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const tourPost = await updateTourPostUseCase.invoke(currentUser, id, req.body);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
