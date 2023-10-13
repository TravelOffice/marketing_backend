import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { OrgKpiMetric } from './models/kpi';
import { createKpiSettingUseCase, getKpiSettingUseCase, updateKpiSettingTargetUseCase } from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import wrapResponse from './utils/wrapResponse';
import validate, { createKpiSettingValidator, getKpiSettingValidator, updateKpiTargetValidator } from './utils/validator';

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

app.get('/settings/kpi', getKpiSettingValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { kpiMetric, start, end } = req.query;
    const kpiSetting = await getKpiSettingUseCase.invoke(
      tenant,
      kpiMetric as OrgKpiMetric,
      {
        start: parseInt(start as string, 10),
        end: parseInt(end as string, 10),
      },
    );
    res.json(wrapResponse(SUCCESS, kpiSetting));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/settings/kpi', createKpiSettingValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const kpiSetting = await createKpiSettingUseCase.invoke(tenant, req.body);
    res.json(wrapResponse(SUCCESS, kpiSetting));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/settings/kpi/update-target', updateKpiTargetValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const kpiSetting = await updateKpiSettingTargetUseCase.invoke(tenant, req.body);
    res.json(wrapResponse(SUCCESS, kpiSetting));
  } catch (error: any) {
    logger.log(`[GET] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

/**
 * APIs will be implemented in the future
 * - /me/settings
 * - /me/settings/kpi
 * - /me/settings/notification
 */

export default app;
