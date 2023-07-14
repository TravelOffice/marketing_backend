import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import {
  createTourTemplateUseCase,
  deleteTourTemplateUseCase,
  getTourTemplateListUseCase,
  getTourTemplateUseCase,
  updateTourTemplateUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createOrUpdateTourTemplateValidator } from './utils/validator';
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

app.get('/tour-templates', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const tourTemplates = await getTourTemplateListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, tourTemplates));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while retrieving tour templates on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post(
  '/tour-templates',
  createOrUpdateTourTemplateValidator(),
  async (req: Request, res: Response) => {
    try {
      validate(req);
      const user = getCurrentUserInfo(
        req.headers.authorization!,
      );
      logger.log(
        `[${req.method}] Request received for tenant '${user.tenant}' on route '${req.originalUrl}'`,
      );
      req.body.creatorId = user.username;
      req.body.creatorName = user.username;
      const tourTemplate = await createTourTemplateUseCase.invoke(
        user.tenant,
        req.body,
      );
      res.json(wrapResponse(SUCCESS, tourTemplate));
    } catch (error: any) {
      logger.log(
        `[${req.method}] An error occurred while creating/updating tour template on route '${req.originalUrl}':`,
        error,
      );
      res.json(wrapResponse(FAILED, undefined, error.message));
    }
  },
);

app.get('/tour-templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const tourTemplate = await getTourTemplateUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, tourTemplate));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while retrieving tour template on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/tour-templates/:id', createOrUpdateTourTemplateValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const tourTemplate = await updateTourTemplateUseCase.invoke(
      tenant,
      id,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, tourTemplate));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while updating tour template on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/tour-templates/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const ret = await deleteTourTemplateUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, ret));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while deleting tour template on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
