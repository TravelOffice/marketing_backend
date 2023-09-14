import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { getMarketplaceUserInfo } from 'decode-token';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, { getPresignedUrlValidator } from './utils/validator';
import wrapResponse from './utils/wrapResponse';
import { createOrgThumbnailUrlUseCase, createPostThumbnailUrlUseCase, createUserAvatarUrlUseCase } from './useCases';

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
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const {
      presignedUrlType, fileType, fileName,
    } = req.query;
    let rs;
    switch (presignedUrlType) {
      case 'ORGANIZATION_THUMBNAIL':
        rs = await createOrgThumbnailUrlUseCase.invoke(
          currentUser,
          fileName as string,
          fileType as string,
        );
        break;
      case 'USER_AVATAR':
        rs = await createUserAvatarUrlUseCase.invoke(
          currentUser,
          fileName as string,
          fileType as string,
        );
        break;
      case 'POST_THUMBNAIL':
        rs = await createPostThumbnailUrlUseCase.invoke(
          currentUser,
          fileName as string,
          fileType as string,
        );
        break;
      default:
        break;
    }
    res.json(wrapResponse(SUCCESS, rs));
  } catch (error: any) {
    logger.log(`[GET /marketplace/presigned-url] Generated an error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
