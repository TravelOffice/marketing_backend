import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { logger } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import {
  createPostRatingUseCase,
  deletePostRatingUseCase,
  getPostRatingListUseCase,
  getPostRatingUseCase,
  updatePostRatingUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createRatingValidator, getPostRatingListValidator, updateRatingValidator } from './utils/validator';

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

app.get('/marketplace/posts/:id/ratings', getPostRatingListValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: tourPostId } = req.params;
    const ratings = await getPostRatingListUseCase.invoke(
      tourPostId,
      req.body as PaginationParams,
    );
    res.json(wrapResponse(SUCCESS, ratings));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts/:id/ratings', createRatingValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: tourPostId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const rating = await createPostRatingUseCase.invoke(currentUser, tourPostId, req.body);
    res.json(wrapResponse(SUCCESS, rating));
  } catch (error: any) {
    logger.log(`[app.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts/:id/ratings/:ratingId', async (req: Request, res: Response) => {
  try {
    const { id, ratingId } = req.params;
    const rating = await getPostRatingUseCase.invoke(id, ratingId);
    res.json(wrapResponse(SUCCESS, rating));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/posts/:id/ratings/:ratingId', updateRatingValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: tourPostId, ratingId } = req.params;
    const rating = await updatePostRatingUseCase.invoke(
      currentUser,
      tourPostId,
      ratingId,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, rating));
  } catch (error: any) {
    logger.log(`[app.put] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/posts/:id/ratings/:ratingId', async (req: Request, res: Response) => {
  try {
    const { id: tourPostId, ratingId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deletePostRatingUseCase.invoke(currentUser, tourPostId, ratingId);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[app.delete] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
