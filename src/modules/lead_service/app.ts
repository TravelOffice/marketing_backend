import compression from 'compression';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { StatusType } from './models/Lead';
import { createOrUpdateLeadUseCase, getLeadUseCase, getLeadListByAssigneeUseCase } from './useCases';
import { getCurrentUserId } from './utils/authorizer';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createLeadValidator, getLeadValidator, updateLeadValidator } from './utils/validator';
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

app.post('/leads', createLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentTime = Date.now();
    req.body.createdAt = currentTime;
    req.body.updatedAt = currentTime;
    req.body.status = StatusType.NEW;
    const userId = getCurrentUserId(req.headers.authorization!);
    const lead = await createOrUpdateLeadUseCase.invoke(req.body, userId);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.post] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads', updateLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentTime = Date.now();
    req.body.updatedAt = currentTime;
    const userId = getCurrentUserId(req.headers.authorization!);
    const lead = await createOrUpdateLeadUseCase.invoke(req.body, userId);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.post] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/leads/:leadId', getLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const leadId = req.params.leadId;
    const userId = getCurrentUserId(req.headers.authorization!);
    const lead = await getLeadUseCase.invoke(leadId, userId);
    res.json(wrapResponse(SUCCESS, lead));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
})

app.get('/leads_assigned/', async (req: Request, res: Response) => {
  try {
    const userId = getCurrentUserId(req.headers.authorization!);
    const leadList = await getLeadListByAssigneeUseCase.invoke(userId);
    res.json(wrapResponse(SUCCESS, leadList));
  } catch (error: any) {
    console.log('[app.get] Error', error);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
})

export default app;
