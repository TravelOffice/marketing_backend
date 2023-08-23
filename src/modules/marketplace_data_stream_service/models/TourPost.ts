import { BaseDdbModel } from 'common-models';
import { TourPostStatus } from './TourPostStatus';
import { TourPostType } from './TourPostType';

export interface TourPost extends BaseDdbModel {
  code: string, // Auto-generated code from DynamoDB
  name: string, // Name of the tour post
  description?: string, // Description of the tour post
  type: TourPostType, // Type of the tour post, can be 'BUY' or 'SELL'
  pricePerPax: number, // Price per pax of the offer
  commissionRate: number, // Commission rate per pax of the offer
  // Lead code / tour template code (pk, sk) of the tenant that this tour post is linked to
  linkedToTargetKeys?: { pk: string, sk: string },
  organization: string, // The ID of organization
  authorId: string, // Alias id of marketplace user that is auto-generated or set by user
  status: TourPostStatus, // Status of the tour post
  expiry?: number, // Expiry time of the tour post. If undefined, the post will never expire
  endingLocation: string // The ending location
  departureDate: string // The departure date
  // Whether the tour post is automatically closed.
  // The post will be closed when the expiry time is reached
  // Also, all the offers of the post will be accepted
  autoClose?: boolean,
  // Number of available pax
  // If === -1, the post will be considered as unlimited buy or sell
  maximumPaxToTrade?: number,
  /**
   * Additional fields that aggregate data from other partitions
   * Such as number of offers, rating average, etc.
   */
  isBookmarked?: boolean, // Whether the tour post is bookmarked by the current user
  isFollowed?: boolean, // Whether the tour post is followed by the current user
  totalOffers?: number, // Number of offers of the tour post
  ratingAverage?: number, // Rating average of the tour post
}
