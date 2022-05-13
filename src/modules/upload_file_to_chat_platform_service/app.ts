import { ChatPlatform } from 'common-models';
import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';
import { getEnv } from 'get-env';
import { s3Repository, zaloMessagePlatformRepository } from './repositories';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { uploadFileToChaPlatformServiceValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';

const app = express();
const fsPromises = fs.promises;

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

app.get('/upload-file-to-chat-platform', uploadFileToChaPlatformServiceValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const {
      pageId, fileKey, fileName, chatPlatform, fileType,
    } = req.query;

    const filePath: string = await s3Repository.downloadFileFromS3(bucket, String(fileKey), String(fileName));
    switch (chatPlatform) {
      case ChatPlatform.zalo:
        const rs = await zaloMessagePlatformRepository.uploadFile(String(pageId), filePath, String(fileType));
        res.json(wrapResponse(SUCCESS, rs));
        break;
      default:
        throw new Error(`Upload file to platform ${chatPlatform} is not supported`);
    }
    // Remove the temporary file which downloaded from S3
    await fsPromises.unlink(filePath);
    // Remove the s3 Object file
    await s3Repository.deleteObject(bucket, String(fileKey));
  } catch (error: unknown) {
    console.log(`[App.ChatZaloWebhook POST] Generated an error`, error);
    let message = 'Unknown Error';
    if (error instanceof Error) message = error.message;
    res.json(wrapResponse(FAILED, undefined, message));
  }
});

export default app;
