import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';

import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, {
  changeCustomerAssigneeValidator,
  createCustomerValidator,
  getCustomerValidator,
  updateCustomerValidator,
} from './utils/validator';
import wrapResponse from './utils/wrapResponse';
import { User } from './models/User';
import {
  changeCustomerAssigneeUseCase, createCustomerUseCase, getCustomerListUseCase, getCustomerUseCase,
} from './useCases';

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

app.post('/customers', createCustomerValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const customer = await createCustomerUseCase.invoke(currentUser as User, req.body);
    res.json(wrapResponse(SUCCESS, customer));
  } catch (error: any) {
    logger.log(`[POST /customers] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/customers', updateCustomerValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    logger.log(`[PUT /customers] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/customers/:customerId', getCustomerValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { customerId } = req.params;
    const customer = await getCustomerUseCase.invoke(tenant, customerId);
    res.json(wrapResponse(SUCCESS, customer));
  } catch (error: any) {
    logger.log(`[GET /customers/:customerId] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/customers', async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const customers = await getCustomerListUseCase.invoke(currentUser.tenant);
    res.json(wrapResponse(SUCCESS, customers));
  } catch (error: any) {
    logger.log(`[GET/customers] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/customers/:customerId/assignee', changeCustomerAssigneeValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { customerId } = req.params;
    const { assignee } = req.body;
    const customer = await changeCustomerAssigneeUseCase.invoke(tenant, customerId, assignee);
    res.json(wrapResponse(SUCCESS, customer));
  } catch (error: any) {
    logger.log(`[PUT /customers/:customerId/assignee] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
