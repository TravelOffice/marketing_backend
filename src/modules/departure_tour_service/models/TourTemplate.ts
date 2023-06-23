import { BaseDdbModel } from 'common-models';
import { TourServicePrice } from './TourServicePrice';
import { TourType } from './TourType';

export interface TourTemplate extends BaseDdbModel {
  code: number,
  name: string,
  type: TourType,
  visitorCount: number,
  startingLocation: string,
  endingLocation: string,
  durationInDays: number,
  durationInNights: number,
  adultPrice: number,
  childUnder5Price?: number,
  child5to7Price?: number,
  child8to11Price?: number,
  otherPrice?: TourServicePrice[],
  policiesAndRegulations: {
    inclusionAndExclusion?: string,
    policyConditionsAndExtraFee?: string,
    cancellationTerms?: string,
  },
  tourPlan: string,
}
