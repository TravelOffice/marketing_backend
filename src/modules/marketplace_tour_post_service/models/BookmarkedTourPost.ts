import { BaseDdbModel } from 'common-models';

export interface BookmarkedTourPost extends BaseDdbModel {
  userId: string, // User ID of the user who bookmarked the tour post
  tourPostId: string, // ID of the tour post that is bookmarked by the user
}
