import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import {
  createTenantRoleUseCase,
  deleteTenantRoleUseCase,
  getListGroupPermissionsUseCase,
  getListTenantRolesUseCase,
  updateTenantRoleUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { createRoleValidator, deleteRoleValidator, updateRoleValidator } from './utils/validator';
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

app.get('/marketplace/admin/roles', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const roles = await getListTenantRolesUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, roles));
  } catch (error: any) {
    logger.log(`[rolePermissionApp.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/admin/roles', createRoleValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { name, permissions } = req.body;
    const role = await createTenantRoleUseCase.invoke(tenant, name, permissions);
    res.json(wrapResponse(SUCCESS, role));
  } catch (error: any) {
    logger.log(`[rolePermissionApp.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/admin/roles/:roleName', updateRoleValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { roleName } = req.params;
    const { permissions } = req.body;
    const role = await updateTenantRoleUseCase.invoke(tenant, roleName, permissions);
    res.json(wrapResponse(SUCCESS, role));
  } catch (error: any) {
    logger.log(`[rolePermissionApp.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/admin/roles/:roleName', deleteRoleValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { roleName } = req.params;
    const role = await deleteTenantRoleUseCase.invoke(tenant, roleName);
    res.json(wrapResponse(SUCCESS, role));
  } catch (error: any) {
    logger.log(`[rolePermissionApp.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});
app.get('/marketplace/admin/permissions', async (req: Request, res: Response) => {
  try {
    const roles = await getListGroupPermissionsUseCase.invoke();
    res.json(wrapResponse(SUCCESS, roles));
  } catch (error: any) {
    logger.log(`[rolePermissionApp.getPermission] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
