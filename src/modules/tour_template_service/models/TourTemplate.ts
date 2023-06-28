import { BaseDdbModel } from 'common-models';
import { ServicePrice } from './TourServicePrice';
import { TourType } from './TourType';

export interface TourTemplate extends BaseDdbModel {
  code: string;
  name: string;
  type: TourType;
  visitorCount: number;
  startingLocation: string;
  endingLocation: string;
  durationInDays: number;
  durationInNights: number;
  adultPrice: number;
  childUnder5Price?: number;
  child5to7Price?: number;
  child8to11Price?: number;
  otherPrice?: ServicePrice[];
  policiesAndRegulations: {
    inclusionAndExclusion?: string;
    policyConditionsAndExtraFee?: string;
    cancellationTerms?: string;
  };
  tourPlan: string;
  createdAt: number;
  updatedAt: number;
}
