import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { logger } from 'core';
import { PaginationParams } from 'core/providers/dynamodb/DynamoProvider';
import {
  createPostCommentUseCase,
  deletePostCommentUseCase,
  getPostCommentListUseCase,
  getPostCommentUseCase,
  updatePostCommentUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createCommentValidator, getPostCommentListValidator, updateCommentValidator } from './utils/validator';

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

app.get('/marketplace/posts/:id/comments', getPostCommentListValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: tourPostId } = req.params;
    const comments = await getPostCommentListUseCase.invoke(
      tourPostId,
      req.body as PaginationParams,
    );
    res.json(wrapResponse(SUCCESS, comments));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts/:id/comments', createCommentValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: tourPostId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const comment = await createPostCommentUseCase.invoke(currentUser, tourPostId, req.body);
    res.json(wrapResponse(SUCCESS, comment));
  } catch (error: any) {
    logger.log(`[app.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts/:id/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { id, commentId } = req.params;
    const comment = await getPostCommentUseCase.invoke(id, commentId);
    res.json(wrapResponse(SUCCESS, comment));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/posts/:id/comments/:commentId', updateCommentValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: tourPostId, commentId } = req.params;
    const comment = await updatePostCommentUseCase.invoke(
      currentUser,
      tourPostId,
      commentId,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, comment));
  } catch (error: any) {
    logger.log(`[app.put] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/posts/:id/comments/:commentId', async (req: Request, res: Response) => {
  try {
    const { id: tourPostId, commentId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deletePostCommentUseCase.invoke(currentUser, tourPostId, commentId);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[app.delete] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
