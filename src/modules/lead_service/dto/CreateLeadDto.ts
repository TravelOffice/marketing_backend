import { Lead } from '../models/Lead';

export type CreateLeadDto = Pick<Lead,
  'email' |
  'name' |
  'phoneNumber' |
  'address' |
  'honorific' |
  'tourTemplateId' |
  'desiredTour' |
  'description' |
  'assigneeId' |
  'sourceId' |
  'numberOfAdultPassengers' |
  'numberOfChildrenPassengers' |
  'departure' |
  'startDate' |
  'type' |
  'tourType' |
  'endingLocationName' |
  'endingLocationCode'
>
