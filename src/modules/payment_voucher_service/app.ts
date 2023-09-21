import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { getCurrentUserInfo } from 'decode-token';
import {
  approvePaymentVoucherUseCase,
  createPaymentVoucherUseCase,
  deletePaymentVoucherUseCase,
  getPaymentVoucherListUseCase,
  getPaymentVouchersFromOpTourUseCase,
  getPaymentVoucherUseCase,
  updatePaymentVoucherUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import { CognitoUser } from './models/CognitoUser';
import validate, {
  approvePaymentVoucherValidator,
  createPaymentVoucherValidator,
  updatePaymentVoucherValidator,
} from './utils/validator';
import logger from './utils/logger';

// Create an instance of the Express application
const app = express();

// Middleware for compressing HTTP responses
app.use(compression());

// Middleware for enabling Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Middleware for parsing JSON request bodies
app.use(express.json());

// Middleware for parsing URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware for setting CORS headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Middleware for logging incoming requests
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

// Route for handling GET requests to the root endpoint
app.get('/payment-vouchers', async (req: Request, res: Response) => {
  try {
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const paymentVoucher = await getPaymentVoucherListUseCase.invoke(tenant);
    res.json(wrapResponse(SUCCESS, paymentVoucher));
  } catch (error: any) {
    logger.log('Error retrieving payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/tours/:tourId/payment-vouchers', async (req: Request, res: Response) => {
  try {
    const { tourId } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const paymentVouchers = await getPaymentVouchersFromOpTourUseCase.invoke(tenant, tourId);
    res.json(wrapResponse(SUCCESS, paymentVouchers));
  } catch (error: any) {
    logger.log('Error retrieving payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling POST requests to the root endpoint
app.post('/payment-vouchers', createPaymentVoucherValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const userInfo = getCurrentUserInfo(req.headers.authorization!);
    const paymentVoucher = await createPaymentVoucherUseCase.invoke(
      userInfo as CognitoUser,
      req.body,
    );
    res.json(wrapResponse(SUCCESS, paymentVoucher));
  } catch (error: any) {
    logger.log('Error creating payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling GET requests to a specific tour location endpoint
app.get('/payment-vouchers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const receipt = await getPaymentVoucherUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, receipt));
  } catch (error: any) {
    logger.log('Error retrieving payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling PUT requests to a specific tour location endpoint
app.put('/payment-vouchers/:id', updatePaymentVoucherValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const receipt = await updatePaymentVoucherUseCase.invoke(tenant, id, req.body);
    res.json(wrapResponse(SUCCESS, receipt));
  } catch (error: any) {
    logger.log('Error updating payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/payment-vouchers/:id/approve', approvePaymentVoucherValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const paymentVoucher = await approvePaymentVoucherUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, paymentVoucher));
  } catch (error: any) {
    logger.log('Error approving payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

// Route for handling DELETE requests to a specific tour location endpoint
app.delete('/payment-vouchers/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    await deletePaymentVoucherUseCase.invoke(tenant, id);
    res.json(wrapResponse(SUCCESS, {}));
  } catch (error: any) {
    logger.log('Error deleting payment voucher:', error.message);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
