import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import {
  getBookingListByLeadUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import { BookingStatus } from './models/Booking';
import { getCurrentUserId } from './utils/authorizer';
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

app.get('/leads/:leadId/bookings', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const { leadId } = req.params;
    const { username } = getCurrentUserId(req.headers.authorization!);
    const bookings = await getBookingListByLeadUseCase.invoke(
      username,
      leadId,
      status as BookingStatus,
    );
    res.json(wrapResponse(SUCCESS, bookings));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
