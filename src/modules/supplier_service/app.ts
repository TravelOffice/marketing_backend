import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  createSupplierUseCase,
  deleteSupplierUseCase,
  getSupplierListUseCase,
  getSupplierUseCase,
  updateSupplierUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, {
  createOrUpdateSupplierValidator,
} from './utils/validator';
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

app.get('/suppliers', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const suppliers = await getSupplierListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, suppliers));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while retrieving suppliers on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post(
  '/suppliers',
  createOrUpdateSupplierValidator(),
  async (req: Request, res: Response) => {
    try {
      validate(req);
      const user = getCurrentUserInfo(
        req.headers.authorization!,
      );
      const { tenant, username, name } = user;
      const body = {
        creatorId: username,
        creatorName: name,
        ...req.body,
      };
      logger.log(
        `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
      );
      const supplier = await createSupplierUseCase.invoke(
        tenant,
        body,
      );
      res.json(wrapResponse(SUCCESS, supplier));
    } catch (error: any) {
      logger.log(
        `[${req.method}] An error occurred while creating/updating supplier on route '${req.originalUrl}':`,
        error,
      );
      res.json(wrapResponse(FAILED, undefined, error.message));
    }
  },
);

app.get('/suppliers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const supplier = await getSupplierUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, supplier));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while retrieving supplier on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/suppliers/:id', createOrUpdateSupplierValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const supplier = await updateSupplierUseCase.invoke(
      tenant,
      id,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, supplier));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while updating supplier on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/suppliers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    logger.log(
      `[${req.method}] Request received for tenant '${tenant}' on route '${req.originalUrl}'`,
    );
    const ret = await deleteSupplierUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, ret));
  } catch (error: any) {
    logger.log(
      `[${req.method}] An error occurred while deleting supplier on route '${req.originalUrl}':`,
      error,
    );
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
