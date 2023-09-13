import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { getEnv } from 'get-env';
import { getMarketplaceUserInfo } from 'decode-token';
import { s3Repository } from './repositories';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { getPresignedUrlValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';
import { GeneratePresignedUrlOption } from './models/GeneratePresignedUrlOption';

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

app.get('/marketplace/presigned-url', getPresignedUrlValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const bucket = getEnv('ATTACHMENT_BUCKET');
    const expires = Number(getEnv('PRESIGNED_URL_EXPIRES'));
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const {
      fileType, fileName,
    } = req.query;
    const option = {
      bucket,
      organization: currentUser.tenant,
      expires,
      fileType: String(fileType),
      fileName: String(fileName),
    } as GeneratePresignedUrlOption;
    const rs = await s3Repository.generatePresignedUrl(option);
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    logger.log(`[GET /marketplace/presigned-url] Generated an error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
