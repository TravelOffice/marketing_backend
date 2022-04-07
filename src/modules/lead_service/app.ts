import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusType } from './models/Lead';
import { createOrUpdateLeadUseCase } from './useCases';
import { getCurrentUserId } from './utils/authorizer';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createLeadValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';


const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/lead', createLeadValidator(), async (req: Request, res: Response) => {
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

app.put('/lead', createLeadValidator(), async (req: Request, res: Response) => {
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

export default app;
