import { PostComment } from '../models/PostComment';
import { marketplaceUserRepository, postCommentRepository } from '../repositories';
import { CreatePostCommentUseCase } from './interfaces/CreatePostCommentUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreatePostCommentDto } from '../dto/CreatePostCommentDto';

export default class CreatePostCommentUseCaseImpl implements CreatePostCommentUseCase {
  /**
   * Creates a comment on a tour post by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post for which the comment is being created.
   * @param {CreatePostCommentDto} createCommentDto - The data for creating the comment.
   * @returns {Promise<PostComment>} - A promise resolving to the created post comment.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    createCommentDto: CreatePostCommentDto,
  ): Promise<PostComment> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the current timestamp
    const now = Date.now();

    // Generate a unique index for the comment
    const commentIndex = await postCommentRepository.generateCode();

    // Create the comment object
    const postComment = {
      ...createCommentDto,
      code: commentIndex,
      authorId: marketplaceUserId,
      tourPostId,
      createdAt: now,
      updatedAt: now,
      // Local secondary index with format <tenant>#<username>
      // for getting comments created by specific user
      lsi1: marketplaceUserId,
    } as PostComment;

    // Add the comment to DynamoDB using the repository
    return postCommentRepository.create(postComment);
  };
}
