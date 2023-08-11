import { TourPost } from '../models/TourPost';

export type CreateTourPostDto = Pick<
  TourPost,
  // Initial status can only be 'DRAFT' or 'IN_PROGRESS'
  'maximumPaxToTrade' | 'type' |
  'name' | 'linkedToTarget' | 'status' |
  'description' | 'expiry' | 'autoClose'
>;
