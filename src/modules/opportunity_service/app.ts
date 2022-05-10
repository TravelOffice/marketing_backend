import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  deleteOpportunityUseCase,
  getMyOpportunitiesUseCase,
  getOpportunitiesByLeadUseCase,
  createOpportunityUseCase,
  getOpportunityUseCase,
  updateOpportunityUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import { getCurrentUserId } from './utils/authorizer';
import validate, { createOpportunityValidator, updateOpportunityValidator } from './utils/validator';
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

app.post('/leads/:leadId/opportunities', createOpportunityValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { leadId } = req.params;
    const userId = getCurrentUserId(req.headers.authorization!);
    const opportunity = await createOpportunityUseCase.invoke(userId, leadId, req.body);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const { leadId, id } = req.params;
    const userId = getCurrentUserId(req.headers.authorization!);
    const opportunity = await getOpportunityUseCase.invoke(id, userId, leadId);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId/opportunities', async (req: Request, res: Response) => {
  try {
    const { leadId } = req.params;
    const userId = getCurrentUserId(req.headers.authorization!);
    const opportunities = await getOpportunitiesByLeadUseCase.invoke(userId, leadId);
    res.json(wrapResponse(SUCCESS, opportunities));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/opportunities', async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req.headers.authorization!);
    const opportunities = await getMyOpportunitiesUseCase.invoke(userId);
    res.json(wrapResponse(SUCCESS, opportunities));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads/:leadId/opportunities/:id', updateOpportunityValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { leadId, id } = req.params;
    const userId = getCurrentUserId(req.headers.authorization!);
    const opportunity = await updateOpportunityUseCase.invoke(id, userId, leadId, req.body);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getCurrentUserId(req.headers.authorization!);
    // TODO: Check condition before delete opportunity.
    // Example: only draft oppotunity can be deleted
    await deleteOpportunityUseCase.invoke(id, userId);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
