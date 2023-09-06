// TODO: Declare use cases which can be used in this service here

import GetOfferListOfPostUseCaseImpl from './GetOfferListOfPostUseCaseImpl';
import { GetOfferListOfPostUseCase } from './interfaces/GetOfferListOfPostUseCase';
import { GetOfferUseCase } from './interfaces/GetOfferUseCase';
import { UpdateOfferUseCase } from './interfaces/UpdateOfferUseCase';
import { GetSentOffersOfOrgUseCase } from './interfaces/GetSentOffersOfOrgUseCase';
import { CreateOfferUseCase } from './interfaces/CreateOfferUseCase';
import { CancelOfferUseCase } from './interfaces/CancelOfferUseCase';
import { AcceptOfferUseCase } from './interfaces/AcceptOfferUseCase';
import { RejectOfferUseCase } from './interfaces/RejectOfferUseCase';
import CreateOfferUseCaseImpl from './CreateOfferUseCaseImpl';
import UpdateOfferUseCaseImpl from './UpdateOfferUseCaseImpl';
import GetSentOffersOfOrgUseCaseImpl from './GetSentOffersOfOrgUseCaseImpl';
import GetOfferUseCaseImpl from './GetOfferUseCaseImpl';
import CancelOfferUseCaseImpl from './CancelOfferUseCaseImpl';
import AcceptOfferUseCaseImpl from './AcceptOfferUseCaseImpl';
import RejectOfferUseCaseImpl from './RejectOfferUseCaseImpl';
import GetSentOffersOfCurrentUserUseCaseImpl from './GetSentOffersOfCurrentUserUseCaseImpl';
import { GetSentOffersOfCurrentUserUseCase } from './interfaces/GetSentOffersOfCurrentUserUseCase';
import { GetReceivedOffersOfOrgUseCase } from './interfaces/GetReceivedOffersOfOrgUseCase';
import GetReceivedOffersOrgUseCaseImpl from './GetReceivedOffersOrgUseCaseImpl';
import { GetReceivedOffersOfCurrentUserUseCase } from './interfaces/GetReceivedOffersOfCurrentUserUseCase';
import GetReceivedOffersOfCurrentUserUseCaseImpl from './GetReceivedOffersOfCurrentUserUseCaseImpl';

interface UseCases {
  getOfferListOfPostUseCase: GetOfferListOfPostUseCase,
  getSentOffersOfOrgUseCase: GetSentOffersOfOrgUseCase,
  getReceivedOffersOfOrgUseCase: GetReceivedOffersOfOrgUseCase,
  getSentOffersOfCurrentUserUseCase: GetSentOffersOfCurrentUserUseCase,
  getReceivedOffersOfCurrentUserUseCase: GetReceivedOffersOfCurrentUserUseCase,
  createOfferUseCase: CreateOfferUseCase,
  getOfferUseCase: GetOfferUseCase,
  updateOfferUseCase: UpdateOfferUseCase,
  cancelOfferUseCase: CancelOfferUseCase,
  acceptOfferUseCase: AcceptOfferUseCase,
  rejectOfferUseCase: RejectOfferUseCase,
}

const useCases: UseCases = {
  getOfferListOfPostUseCase: new GetOfferListOfPostUseCaseImpl(),
  getSentOffersOfOrgUseCase: new GetSentOffersOfOrgUseCaseImpl(),
  getReceivedOffersOfOrgUseCase: new GetReceivedOffersOrgUseCaseImpl(),
  getSentOffersOfCurrentUserUseCase: new GetSentOffersOfCurrentUserUseCaseImpl(),
  getReceivedOffersOfCurrentUserUseCase: new GetReceivedOffersOfCurrentUserUseCaseImpl(),
  createOfferUseCase: new CreateOfferUseCaseImpl(),
  getOfferUseCase: new GetOfferUseCaseImpl(),
  updateOfferUseCase: new UpdateOfferUseCaseImpl(),
  cancelOfferUseCase: new CancelOfferUseCaseImpl(),
  acceptOfferUseCase: new AcceptOfferUseCaseImpl(),
  rejectOfferUseCase: new RejectOfferUseCaseImpl(),
};

export const {
  getOfferListOfPostUseCase,
  getSentOffersOfOrgUseCase,
  getReceivedOffersOfOrgUseCase,
  getSentOffersOfCurrentUserUseCase,
  getReceivedOffersOfCurrentUserUseCase,
  createOfferUseCase,
  getOfferUseCase,
  updateOfferUseCase,
  cancelOfferUseCase,
  acceptOfferUseCase,
  rejectOfferUseCase,
} = useCases;
