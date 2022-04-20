import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { linkFacebookPageUseCase } from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import { getCurrentUserInfo } from './utils/authorizer';
import validate, { linkFacebookPageValidator } from './utils/validator';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`Request to ${req.method}: ${req.url}`);
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
    const {username} = getCurrentUserInfo(req.headers.authorization!);
    const modelNames = await linkFacebookPageUseCase.invoke(username, pageId, userAccessToken);
    res.json(wrapResponse(SUCCESS, modelNames));
  } catch (error: any) {
    console.log('error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
