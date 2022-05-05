import compression from 'compression';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { LeadType, LeadStatus } from './models/Lead';
import {
  createLeadUseCase, getLeadUseCase,
  getLeadListByAssigneeUseCase, updateLeadUseCase,
  getLeadListByTenantUseCase,
} from './useCases';
import { getCurrentUserInfo } from './utils/authorizer';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createUpdateLeadValidator, getLeadValidator, getAllLeadByAssigneeValidator } from './utils/validator';
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

app.post('/leads', createUpdateLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentTime = Date.now();
    const { username, name } = getCurrentUserInfo(req.headers.authorization!);
    req.body.createdAt = currentTime;
    req.body.updatedAt = currentTime;
    req.body.status = LeadStatus.NEW;
    req.body.creatorId = username;
    req.body.creatorName = name;
    req.body.assigneeId = username;
    req.body.assigneeName = name;
    const lead = await createLeadUseCase.invoke(req.body, username);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.post] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads', createUpdateLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentTime = Date.now();
    req.body.updatedAt = currentTime;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const lead = await updateLeadUseCase.invoke(req.body, username);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.post] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId', getLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { leadId } = req.params;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const lead = await getLeadUseCase.invoke(leadId, username);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads', getAllLeadByAssigneeValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const { type, status } = req.query;
    const leadList = await getLeadListByAssigneeUseCase.invoke(
      username,
      type as LeadType,
      status as LeadStatus,
    );
    res.json(wrapResponse(SUCCESS, leadList));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/admin/leads', async (req: Request, res: Response) => {
  try {
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const leadList = await getLeadListByTenantUseCase.invoke(username);
    res.json(wrapResponse(SUCCESS, leadList));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
