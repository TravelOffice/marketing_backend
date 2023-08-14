import { BaseDdbModel } from 'common-models';

export interface FollowedTourPost extends BaseDdbModel {
  userId: string, // User ID of the user who bookmarked the tour post
  tourPostId: string, // ID of the tour post that is followed by the user
}
