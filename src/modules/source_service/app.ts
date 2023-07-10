import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { logger } from 'core';
import {
  createSourceUseCase, deleteSourceUseCase, getSourceListUseCase, getSourceUseCase,
  updateSourceUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { createSourceValidator, updateSourceValidator } from './utils/validator';

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

app.get('/sources', async (req: Request, res: Response) => {
  try {
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const sources = await getSourceListUseCase.invoke(currentUser);
    res.json(wrapResponse(SUCCESS, sources));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.post('/sources', createSourceValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const source = await createSourceUseCase.invoke(currentUser, req.body);
    res.json(wrapResponse(SUCCESS, source));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.get('/sources/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const source = await getSourceUseCase.invoke(currentUser, id);
    res.json(wrapResponse(SUCCESS, source));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.put('/sources/:id', updateSourceValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const source = await updateSourceUseCase.invoke(currentUser, id, req.body);
    res.json(wrapResponse(SUCCESS, source));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

app.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    await deleteSourceUseCase.invoke(currentUser, id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (e: any) {
    res.json(wrapResponse(FAILED, undefined, e.message));
  }
});

export default app;
