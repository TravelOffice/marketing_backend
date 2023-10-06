export interface TourTemplate {
  code: string,
  name: string,
  type: string,
  visitorCount: number,
  startingLocation: string,
  endingLocation: string,
  durationInDays: number,
  durationInNights: number,
  policiesAndRegulations: {
    inclusionAndExclusion?: string,
    policyConditionsAndExtraFee?: string,
    cancellationTerms?: string,
  },
  tourPlan: string,
  creatorId: string,
  creatorName: string,
}
