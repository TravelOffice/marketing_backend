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
import GetOfferListOfAuthorUseCaseImpl from './GetOfferListOfAuthorUseCaseImpl';
import { GetOfferListOfAuthorUseCase } from './interfaces/GetOfferListOfAuthorUseCase';
import { GetReceivedOffersOfOrgUseCase } from './interfaces/GetReceivedOffersOfOrgUseCase';
import GetReceivedOffersOrgUseCaseImpl from './GetReceivedOffersOrgUseCaseImpl';

interface UseCases {
  getOfferListOfPostUseCase: GetOfferListOfPostUseCase,
  getSentOffersOfOrgUseCase: GetSentOffersOfOrgUseCase,
  getReceivedOffersOfOrgUseCase: GetReceivedOffersOfOrgUseCase,
  getOfferListOfAuthorUseCase: GetOfferListOfAuthorUseCase,
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
  getOfferListOfAuthorUseCase: new GetOfferListOfAuthorUseCaseImpl(),
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
  getOfferListOfAuthorUseCase,
  createOfferUseCase,
  getOfferUseCase,
  updateOfferUseCase,
  cancelOfferUseCase,
  acceptOfferUseCase,
  rejectOfferUseCase,
} = useCases;
