import compression from 'compression';
import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { getEnv } from 'get-env';
import { s3Repository } from './repositories';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { getPresignedUrlValidator, getAvatarPresignedUrlValidator, getPaymentVoucherPresignedUrlValidator } from './utils/validator';
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

app.get('/presigned-url', getPresignedUrlValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    const {
      pageId, customerId, fileType, fileName,
    } = req.query;
    const option = {
      bucket,
      pageId: String(pageId),
      customerId: String(customerId),
      expires,
      fileType: String(fileType),
      fileName: String(fileName),
    };
    const rs = await s3Repository.generatePresignedUrl(option);
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    logger.log(`[GET /presigned-url] Generated an error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/me/avatar/presigned-url', getAvatarPresignedUrlValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant, username } = getCurrentUserInfo(req.headers.authorization!);
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    const {
      fileType, fileName,
    } = req.query;
    const option = {
      bucket,
      tenant,
      username,
      fileType: String(fileType),
      fileName: String(fileName),
      expires,
    };
    const rs = await s3Repository.generateAvatarPresignedUrl(option);
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    logger.log(`[GET /me/avatar/presigned-url] Generated an error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/payment-vouchers/presigned-url', getPaymentVoucherPresignedUrlValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { tenant } = getCurrentUserInfo(req.headers.authorization!);
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    const {
      fileType, fileName,
    } = req.query;
    const option = {
      bucket,
      tenant,
      fileType: String(fileType),
      fileName: String(fileName),
      expires,
    };
    const rs = await s3Repository.generatePaymentVoucherPresignedUrl(option);
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    logger.log(`[GET /payment-vouchers/presigned-url] Generated an error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
