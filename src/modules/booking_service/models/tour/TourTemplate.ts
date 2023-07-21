import { BaseDdbModel } from 'common-models';
import { TourServicePrice } from './TourServicePrice';
import { TourType } from './TourType';

export interface TourTemplate extends BaseDdbModel {
  code: string,
  name: string,
  type: TourType,
  visitorCount: number,
  startingLocation: string,
  endingLocation: string,
  durationInDays: number,
  durationInNights: number,
  services?: TourServicePrice[],
  policiesAndRegulations: {
    inclusionAndExclusion?: string,
    policyConditionsAndExtraFee?: string,
    cancellationTerms?: string,
  },
  tourPlan: string,
  creatorId: string,
  creatorName: string,
}
