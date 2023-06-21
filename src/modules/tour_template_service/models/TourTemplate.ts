import { ServicePrice } from "./ TourServicePrice";
import { TourStatus } from "./TourStatus";
import { TourType } from "./TourType";

export interface TourTemplate {
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
  lsi1: TourStatus;
  tenant: string;
}
