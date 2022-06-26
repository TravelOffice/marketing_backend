import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { OpportunityStatus } from './models/Opportunity';
import {
  createOpportunityUseCase, deleteOpportunityUseCase,
  getMyOpportunitiesUseCase,
  getOpportunitiesByLeadUseCase, getOpportunityUseCase,
  updateOpportunityUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, {
  createOpportunityValidator,
  getMyOpportunitiesValidator,
  getOpportunitiesByLeadValidator,
  updateOpportunityValidator,
} from './utils/validator';
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

app.post('/leads/:leadId/opportunities', createOpportunityValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { leadId } = req.params;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const opportunity = await createOpportunityUseCase.invoke(username, leadId, req.body);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const { leadId, id } = req.params;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const opportunity = await getOpportunityUseCase.invoke(id, username, leadId);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId/opportunities', getOpportunitiesByLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { leadId } = req.params;
    const { status } = req.query;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const opportunities = await getOpportunitiesByLeadUseCase.invoke(
      username,
      leadId,
      status as OpportunityStatus,
    );
    res.json(wrapResponse(SUCCESS, opportunities));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/opportunities', getMyOpportunitiesValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { status } = req.query;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const opportunities = await getMyOpportunitiesUseCase.invoke(
      username,
      status as OpportunityStatus,
    );
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
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const opportunity = await updateOpportunityUseCase.invoke(id, username, leadId, req.body);
    res.json(wrapResponse(SUCCESS, opportunity));
  } catch (error: any) {
    logger.log(error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/opportunities/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    // TODO: Check condition before delete opportunity.
    // Example: only draft oppotunity can be deleted
    await deleteOpportunityUseCase.invoke(id, username);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
