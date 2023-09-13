import cors from 'cors';
import { getMarketplaceUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  createMarketplaceTermsEvidenceUseCase,
  getMarketplaceTermsEvidenceUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createTermsAcceptedEvidencevalidator } from './utils/validator';
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

app.post('/marketplace/onboarding/accept-terms', createTermsAcceptedEvidencevalidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { version } = req.body;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const termsEvidence = await createMarketplaceTermsEvidenceUseCase.invoke(currentUser, version);
    logger.log(`[POST] First time accept marketplace terms successfully ${termsEvidence}`);
    res.json(wrapResponse(SUCCESS, termsEvidence));
  } catch (error: any) {
    logger.log(`[POST] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/accept-terms', async (req: Request, res: Response) => {
  try {
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const termsEvidence = await getMarketplaceTermsEvidenceUseCase.invoke(currentUser);
    logger.log(`[GET] Get marketplace accepted terms successfully ${termsEvidence}`);
    res.json(wrapResponse(SUCCESS, termsEvidence));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// TBD: Add more APIs related to system administration activities
// such as system versions, settings management api, etc

export default app;
