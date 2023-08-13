import { BookmarkedTourPost } from '../../models/BookmarkedTourPost';
import { CognitoUser } from '../../models/CognitoUser';

export interface BookmarkTourPostUseCase {
  invoke(
    currentUser: CognitoUser,
    tourPostId: string,
  ): Promise<Partial<BookmarkedTourPost> | undefined>,
}
