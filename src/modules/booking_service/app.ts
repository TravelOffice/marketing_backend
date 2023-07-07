import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import {
  cancelBookingsUseCase,
  createBookingFromLeadUseCase,
  createBookingUseCase,
  getAllBookingsUseCase,
  getBookingByGivenIdUseCase,
  getBookingsByStatusUseCase,
  sendEmailToTourOperator,
  updateBookingUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, NO_REPLY_DEFAULT_EMAIL, SUCCESS } from './utils/constants';
import validate, {
  validateCancelBookingDataInput,
  validateGetBookingFilteredParams,
  validateNewBookingFromLeadParams,
  validateNewBookingParams,
  validateSendEmailToTourGuideParams,
  validateUpdateBookingParams,
} from './utils/validator';
import logger from './utils/logger';
import { BookingStatus } from './models/booking/Booking';

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

app.get('/bookings', validateGetBookingFilteredParams(), async (req: Request, res: Response) => {
  try {
    const isFilteredParamsEmpty = !Object.keys(req.params).length;
    if (!isFilteredParamsEmpty) {
      // TODO: Implement by using ElasticSearch functionality
      validate(req);
      throw new Error('Feature is not implemented.');
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

app.post('/bookings', validateNewBookingParams(), async (req: Request, res: Response) => {
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

app.post('/bookings/create-from-lead', validateNewBookingFromLeadParams(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const user = getCurrentUserInfo(req.headers.authorization!);
    const createdBooking = await createBookingFromLeadUseCase.invoke(user, req.body);
    res.json(wrapResponse(SUCCESS, createdBooking));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/bookings/:id', validateUpdateBookingParams(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { id } = req.params;
    const updatedBooking = await updateBookingUseCase.invoke(tenant, id, req.body);
    res.json(wrapResponse(SUCCESS, updatedBooking));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/bookings-by-status/:status', validateGetBookingFilteredParams(), async (req: Request, res: Response) => {
  try {
    // Get all bookings related to tenant
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { status } = req.params;
    const bookings = await getBookingsByStatusUseCase.invoke(
      tenant,
      status as BookingStatus,
    );
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

app.put('/bookings/:id/cancel', validateCancelBookingDataInput(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { id } = req.params;
    const { reason } = req.body;
    const booking = await cancelBookingsUseCase.invoke(tenant, id, reason);
    res.json(wrapResponse(SUCCESS, booking));
  } catch (error: any) {
    logger.log(`[PUT /bookings/:id/cancel] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/bookings/:id/send-email-to-tour-operator', validateSendEmailToTourGuideParams(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const { id } = req.params;
    await sendEmailToTourOperator.invoke(tenant, id, NO_REPLY_DEFAULT_EMAIL, req.body);
    res.json(wrapResponse(SUCCESS));
  } catch (error: any) {
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
