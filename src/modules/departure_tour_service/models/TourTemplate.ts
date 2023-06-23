import { TourServicePrice } from './TourServicePrice';
import { TourType } from './TourType';

export interface TourTemplate {
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
    cancellationTerms?: string
  },
  tourPlan: string,
  lsi1: string, // (Ex: TOUR#STATUS#NEW)
  createdAt: number,
  updatedAt: number,
}
