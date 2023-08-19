import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { logger } from 'core';
import {
  createOrgFeedbackUseCase,
  deleteOrgFeedbackUseCase,
  getOrgFeedbackListUseCase,
  getOrgFeedbackUseCase,
  updateOrgFeedbackUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, {
  createOrgFeedbackValidator,
  getOrgFeedbackListValidator,
  updateOrgFeedbackValidator,
} from './utils/validator';

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

app.get('/marketplace/organizations/:id/feedback', getOrgFeedbackListValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: organization } = req.params;
    const feedback = await getOrgFeedbackListUseCase.invoke(
      organization,
      req.query,
    );
    res.json(wrapResponse(SUCCESS, feedback));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/organizations/:id/feedback', createOrgFeedbackValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: organization } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const comment = await createOrgFeedbackUseCase.invoke(currentUser, organization, req.body);
    res.json(wrapResponse(SUCCESS, comment));
  } catch (error: any) {
    logger.log(`[app.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/organizations/:id/feedback/:feedbackId', async (req: Request, res: Response) => {
  try {
    const { id: organization, feedbackId } = req.params;
    const feedback = await getOrgFeedbackUseCase.invoke(organization, feedbackId);
    res.json(wrapResponse(SUCCESS, feedback));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/organizations/:id/feedback/:feedbackId', updateOrgFeedbackValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: organization, feedbackId } = req.params;
    const feedback = await updateOrgFeedbackUseCase.invoke(
      currentUser,
      organization,
      feedbackId,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, feedback));
  } catch (error: any) {
    logger.log(`[app.put] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/organizations/:id/feedback/:feedbackId', async (req: Request, res: Response) => {
  try {
    const { id: organization, feedbackId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deleteOrgFeedbackUseCase.invoke(currentUser, organization, feedbackId);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[app.delete] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
