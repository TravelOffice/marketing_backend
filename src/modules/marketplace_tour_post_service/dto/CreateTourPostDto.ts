import { TourPost } from '../models/TourPost';

export type CreateTourPostDto = Pick<
  TourPost,
  // Initial status can only be 'IN_PROCESS'
  'maximumPaxToTrade' | 'type' |
  'name' | 'linkedToTargetKeys' | 'status' |
  'description' | 'expiry' | 'autoClose' |
  'endingLocation' | 'departureDate' | 'thumbnail'
>;
