import cors from 'cors';
import { getCurrentUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import compression from 'compression';
import { logger } from 'core';
import {
  acceptOfferUseCase,
  cancelOfferUseCase,
  createOfferUseCase,
  getOfferListOfAuthorUseCase,
  getOfferListOfPostUseCase,
  getOfferUseCase,
  getReceivedOffersOfOrgUseCase,
  getSentOffersOfOrgUseCase,
  rejectOfferUseCase,
  updateOfferUseCase,
} from './useCases';
import wrapResponse from './utils/wrapResponse';
import { FAILED, SUCCESS } from './utils/constants';
import validate, {
  acceptOfferValidator,
  cancelOfferValidator,
  createOfferValidator,
  getOfferListOfAuthorValidator,
  getOfferListOfOrgValidator,
  getOfferListOfPostValidator,
  rejectOfferValidator,
  updateOfferValidator,
} from './utils/validator';
import { OfferStatus } from './models/Offer';

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

app.get('/marketplace/posts/:id/offers', getOfferListOfPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: tourPostId } = req.params;
    const offers = await getOfferListOfPostUseCase.invoke(currentUser, tourPostId);
    res.json(wrapResponse(SUCCESS, offers));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts/:id/offers', createOfferValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: tourPostId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const offer = await createOfferUseCase.invoke(currentUser, tourPostId, req.body);
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.post] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me/organizations/sent-offers', getOfferListOfOrgValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const {
      offerStatus, ...paginationParams
    } = req.query;
    const offers = await getSentOffersOfOrgUseCase.invoke(
      currentUser,
      offerStatus as OfferStatus,
      paginationParams,
    );
    res.json(wrapResponse(SUCCESS, offers));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me/organizations/received-offers', getOfferListOfOrgValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const {
      ...paginationParams
    } = req.query;
    const offers = await getReceivedOffersOfOrgUseCase.invoke(
      currentUser,
      paginationParams,
    );
    res.json(wrapResponse(SUCCESS, offers));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/offers/:id', async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: offerId } = req.params;
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const offer = await getOfferUseCase.invoke(
      currentUser,
      offerId,
    );
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/offers/:id', updateOfferValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: code } = req.params;
    const offer = await updateOfferUseCase.invoke(
      currentUser,
      {
        ...req.body,
        code,
      },
    );
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.put] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/offers/:id/cancel', cancelOfferValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: offerId } = req.params;
    const { cancelReason } = req.body;
    const offer = await cancelOfferUseCase.invoke(
      currentUser,
      offerId,
      cancelReason,
    );
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/offers/:id/accept', acceptOfferValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: offerId } = req.params;
    const offer = await acceptOfferUseCase.invoke(
      currentUser,
      offerId,
    );
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/offers/:id/reject', rejectOfferValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { id: offerId } = req.params;
    const { rejectReason } = req.body;
    const offer = await rejectOfferUseCase.invoke(
      currentUser,
      offerId,
      rejectReason,
    );
    res.json(wrapResponse(SUCCESS, offer));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me/offers', getOfferListOfAuthorValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getCurrentUserInfo(req.headers.authorization!);
    const { ...paginationParams } = req.query;
    const offers = await getOfferListOfAuthorUseCase.invoke(
      currentUser,
      paginationParams,
    );
    res.json(wrapResponse(SUCCESS, offers));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

export default app;
