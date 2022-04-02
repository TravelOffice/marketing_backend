import { ChatPlatform } from 'common-models';
import compression from 'compression';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { getEnv } from 'get-env';
import { s3Repository, zaloMessagePlatformRepository } from './repositories';
import { FAILED, SUCCESS } from './utils/constants';
import validate, { uploadFileToChaPlatformServiceValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/upload-file-to-chat-platform', uploadFileToChaPlatformServiceValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const bucket = getEnv('ATTACHMENT_MESSAGE_BUCKET');
    const { pageId, fileKey, fileName, chatPlatform, fileType } = req.query;

    const filePath = await s3Repository.downloadFileFromS3(bucket, String(fileKey), String(fileName));
    switch (chatPlatform) {
      case ChatPlatform.zalo:
        const rs = await zaloMessagePlatformRepository.uploadFile(String(pageId), String(filePath), String(fileType));
        res.json(wrapResponse(SUCCESS, rs));
      default:
        throw new Error(`Upload file to platform ${chatPlatform} is not supported`);
    }
  } catch (error: unknown) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    res.json(wrapResponse(FAILED, undefined, message));
  }
});

export default app;
