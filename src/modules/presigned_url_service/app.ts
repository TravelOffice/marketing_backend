import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import { getEnv } from 'get-env';
import compression from 'compression';
import { s3Repository } from './repositories';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { getPresignedUrlValidator } from './utils/validator';

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
    const { pageId, customerId, fileType } = req.query;
    // eslint-disable-next-line max-len
    const rs = await s3Repository.generatePresignedUrl(bucket, String(pageId), String(customerId), expires, String(fileType));
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
