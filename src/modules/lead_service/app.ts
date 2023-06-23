import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  cancelLeadUseCase, changeLeadStatusUseCase, createLeadUseCase, getLeadListUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, {
  cancelLeadValidator, changeLeadStatusValidator, createUpdateLeadValidator, getLeadValidator,
} from './utils/validator';
import wrapResponse from './utils/wrapResponse';
import { User } from './models/User';

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

app.post('/leads', createUpdateLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const lead = await createLeadUseCase.invoke(currentUser as User, req.body);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    logger.log(`[POST /leads] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads', createUpdateLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[PUT /leads] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId', getLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[GET /leads/:leadId] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads', async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const leads = await getLeadListUseCase.invoke(currentUser.tenant);
    res.json(wrapResponse(SUCCESS, leads));
  } catch (error: any) {
    logger.log(`[GET/leads] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads/:leadId/status', changeLeadStatusValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const { leadId } = req.params;
    const { status } = req.body;
    const lead = await changeLeadStatusUseCase.invoke(tenant, username, leadId, status);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    logger.log(`[PUT /leads/:leadId/status] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads/:leadId/cancel', cancelLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const { leadId } = req.params;
    const { reason } = req.body;
    const lead = await cancelLeadUseCase.invoke(tenant, username, leadId, reason);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    logger.log(`[PUT /leads/:leadId/status] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
