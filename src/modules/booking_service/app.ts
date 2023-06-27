import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import {
  createBookingUseCase,
  getAllBookingsUseCase,
  getBookingByGivenIdUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, {
  validateGetBookingFilteredParams,
  validateNewBookingDataInput,
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

app.post('/bookings', validateNewBookingDataInput(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const user = getCurrentUserInfo(req.headers.authorization!);
    const createdBooking = await createBookingUseCase.invoke(user, req.body);
    res.json(wrapResponse(SUCCESS, createdBooking));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/bookings', validateGetBookingFilteredParams(), async (req: Request, res: Response) => {
  try {
    const isFilteredParamsEmpty = !Object.keys(req.params).length;
    if (!isFilteredParamsEmpty) {
      // TODO: Implement by using ElasticSearch functionality
      validate(req);
      throw new Error('Feature is not impqlemented.');
    }

    // Get all bookings related to tenant
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const bookings = await getAllBookingsUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, bookings));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/bookings/:id', async (req: Request, res: Response) => {
  try {
    // Get booking by given id
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const booking = await getBookingByGivenIdUseCase.invoke(tenant, id);
    if (!booking) throw new Error('Not found.');
    res.json(wrapResponse(SUCCESS, booking));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
