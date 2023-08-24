import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { manualAssignChatUseCase } from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { manualAssignChatValidator } from './utils/validator';
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

app.post('/admin/assign-chat', manualAssignChatValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const {
      chatPlatform, pageId, conversationId, assignee,
    } = req.body;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const conversation = await manualAssignChatUseCase.invoke({
      tenant,
      chatPlatform,
      pageId,
      conversationId,
    }, assignee);
    res.json(wrapResponse(SUCCESS, conversation));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
