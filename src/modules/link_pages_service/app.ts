import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { CognitoUser } from './models/CognitoUser';
import {
  generateLoginUrlUseCase,
  linkFacebookPageUseCase,
  linkTelegramPageUseCase,
  linkZaloPageUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { linkFacebookPageValidator, linkTelegramPageValidator, linkZaloPageValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.post('/facebook/link', linkFacebookPageValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { userAccessToken, pageId } = req.body;
    const currentUser = getCurrentUserInfo(req.headers.authorization!) as CognitoUser;
    const modelNames = await linkFacebookPageUseCase.invoke(currentUser, pageId, userAccessToken);
    res.json(wrapResponse(SUCCESS, modelNames));
  } catch (error: any) {
    logger.log(`[POST /facebook/link] Error ${JSON.stringify(error)}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/zalo/link', linkZaloPageValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { authorizationCode, state, pageId } = req.body;
    const currentUser = getCurrentUserInfo(req.headers.authorization!) as CognitoUser;
    const zaloPage = await linkZaloPageUseCase.invoke(
      currentUser,
      authorizationCode,
      state,
      pageId,
    );
    res.json(wrapResponse(SUCCESS, zaloPage));
  } catch (error: any) {
    logger.log(`[POST /zalo/link] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/zalo/link', async (req: Request, res: Response) => {
  try {
    const loginUrl = await generateLoginUrlUseCase.invoke();
    res.json(wrapResponse(SUCCESS, loginUrl));
  } catch (error: any) {
    logger.log(`[GET /zalo/link] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/telegram/link', linkTelegramPageValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { token } = req.body;
    const currentUser = getCurrentUserInfo(req.headers.authorization!) as CognitoUser;
    const telegramPage = await linkTelegramPageUseCase.invoke(currentUser, token);
    res.json(wrapResponse(SUCCESS, telegramPage));
  } catch (error: any) {
    logger.log(`[GET /telegram/link] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
