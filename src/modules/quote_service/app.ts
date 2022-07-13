import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { QuoteStatus } from './models/Quote';
import {
  createQuoteUseCase,
  deleteQuoteUseCase,
  getLatestQuotesByAssigneeUseCase,
  getQuotesByOpportunityUseCase,
  getQuoteUseCase,
  updateQuoteUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { getlatestQuotesByAssigneeValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';
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

app.get('/quotes', getlatestQuotesByAssigneeValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const { status } = req.query;
    const quotes = await getLatestQuotesByAssigneeUseCase.invoke(username, status as QuoteStatus);
    res.json(wrapResponse(SUCCESS, quotes));
  } catch {
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.post('/', async (req: Request, res: Response) => {
  try {
    // TODO: Validate request body if needed
    const quote = await createQuoteUseCase.invoke(req.body);
    res.json(wrapResponse(SUCCESS, quote));
  } catch (error: any) {
    logger.log(`[POST /] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    const quote = await getQuoteUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, quote));
  } catch (error: any) {
    logger.log(`[GET /:id] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    // TODO: Validate request body if needed
    const quote = await updateQuoteUseCase.invoke(id, req.body);
    res.json(wrapResponse(SUCCESS, quote));
  } catch (error: any) {
    logger.log(`[PUT /:id] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Convert the `id` to integer if needed
    await deleteQuoteUseCase.invoke(id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log(`[DELETE /:id] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined));
  }
});

app.get('/leads/:leadId/opportunities/:oppId/quotes', async (req: Request, res: Response) => {
  try {
    const { leadId, oppId } = req.params;
    const { status } = req.query;
    const { username } = getCurrentUserInfo(req.headers.authorization!);
    const quotesByOpportunity = await getQuotesByOpportunityUseCase.invoke(
      username,
      leadId,
      oppId,
      status as string,
    );
    res.json(wrapResponse(SUCCESS, quotesByOpportunity));
  } catch (error: any) {
    logger.log(`[GET /leads/:leadId:opportunities/:oppId/quotes] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
