import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { logger } from 'core';
import {
  activateSessionUseCase,
  closeSessionUseCase,
  createSessionUseCase,
  getListOfSessionByConversationId,
  getSessionUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createSessionValidator } from './utils/validator';

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

app.get('/conversations/:id/chat-sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { id: conversationId, sessionId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const sessions = await getSessionUseCase.invoke(currentUser, conversationId, sessionId);
    res.json(wrapResponse(SUCCESS, sessions));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.post('/conversations/:id/chat-sessions', createSessionValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: conversationId } = req.params;
    const { platform } = req.body;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const session = await createSessionUseCase.invoke(currentUser, conversationId, platform);
    res.json(wrapResponse(SUCCESS, session));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.get('/conversations/:id/chat-sessions', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const session = await getListOfSessionByConversationId.invoke(currentUser, id);
    res.json(wrapResponse(SUCCESS, session));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.put('/conversations/:id/chat-sessions/:sessionId/activate', async (req: Request, res: Response) => {
  try {
    const { id: conversationId, sessionId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const session = await activateSessionUseCase.invoke(
      currentUser,
      conversationId,
      sessionId,
    );
    res.json(wrapResponse(SUCCESS, session));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.put('/conversations/:id/chat-sessions/:sessionId/close', async (req: Request, res: Response) => {
  try {
    const { id: conversationId, sessionId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const session = await closeSessionUseCase.invoke(
      currentUser,
      conversationId,
      sessionId,
    );
    res.json(wrapResponse(SUCCESS, session));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

export default app;
