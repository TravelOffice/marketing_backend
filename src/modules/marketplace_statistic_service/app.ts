import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  getMarketplaceStatisticUseCase,
  getOrganizationStatisticUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { getOrganizationStatisticValidator } from './utils/validator';
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

app.get('/marketplace/statistic', async (req: Request, res: Response) => {
  try {
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const marketplaceStatistics = await getMarketplaceStatisticUseCase.invoke();
    res.json(wrapResponse(SUCCESS, marketplaceStatistics));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.get(
  '/marketplace/organizations/:id/statistic',
  getOrganizationStatisticValidator(),
  async (req: Request, res: Response) => {
    try {
      validate(req);
      const currentUser = getCurrentUserInfo(req.headers.authorization!);
      const { tenant } = currentUser;
      const marketplaceStatistics = await getOrganizationStatisticUseCase.invoke(tenant);
      res.json(wrapResponse(SUCCESS, marketplaceStatistics));
    } catch {
      res.json(wrapResponse(FAILED, undefined));
    }
  },
);

export default app;
