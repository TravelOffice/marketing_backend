import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { generateLoginUrlUseCase, linkZaloPageUseCase } from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { linkZaloPageValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request to ${req.method}: ${req.url}`);
  next();
});

app.post('/zalo/link', linkZaloPageValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { authorizationCode, state, pageId } = req.body;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const zaloPage = await linkZaloPageUseCase.invoke(username, authorizationCode, state, pageId);
    res.json(wrapResponse(SUCCESS, zaloPage));
  } catch (error: any) {
    console.log('[app.post] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/zalo/link', async (req: Request, res: Response) => {
  try {
    const loginUrl = await generateLoginUrlUseCase.invoke();
    res.json(wrapResponse(SUCCESS, loginUrl));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
