import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { changeStatusLeadValidator, createUpdateLeadValidator, getLeadValidator } from './utils/validator';
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
    res.json(wrapResponse(SUCCESS));
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
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[GET/leads] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/leads/:leadId/status', changeStatusLeadValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[PUT /leads/:leadId/status] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
