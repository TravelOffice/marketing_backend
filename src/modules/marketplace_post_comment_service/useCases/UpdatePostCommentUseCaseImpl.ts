import { helper } from 'core';
import { marketplaceUserRepository, postCommentRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';
import { UpdatePostCommentUseCase } from './interfaces/UpdatePostCommentUseCase';
import { UpdatePostCommentDto } from '../dto/UpdatePostCommentDto';
import { PostComment } from '../models/PostComment';

export default class UpdatePostCommentUseCaseImpl implements UpdatePostCommentUseCase {
  private allowedUpdatingKeys: (keyof UpdatePostCommentDto)[] = [
    'description',
  ];

  /**
   * Updates a post comment by the current marketplace user.
   *
   * @param {CognitoUser} currentUser - The current authenticated user.
   * @param {string} tourPostId - The ID of the tour post associated with the comment.
   * @param {string} postCommentId - The ID of the comment to be updated.
   * @param {UpdatePostCommentDto} updateCommentDto - The data for updating the comment.
   * @returns {Promise<PostComment>} - A promise indicating the success of the update.
   */
  invoke = async (
    currentUser: CognitoUser,
    tourPostId: string,
    postCommentId: string,
    updateCommentDto: UpdatePostCommentDto,
  ): Promise<PostComment> => {
    // Extract necessary information from the current user
    const { tenant, username } = currentUser;
    const marketplaceUserId = `${tenant}#${username}`;

    // Retrieve the marketplace user from the repository
    const marketplaceUser = await marketplaceUserRepository.getById(marketplaceUserId);
    if (!marketplaceUser) {
      throw new Error('Marketplace user not found');
    }

    // Get the ID of the marketplace user
    const currentUserId = marketplaceUser.id;

    // Retrieve the comment to be updated
    const comment = await postCommentRepository.get(tourPostId, postCommentId);
    if (!comment) {
      throw new Error('Tour comment not found');
    }

    // Check if the current user is the owner of the comment
    if (comment.authorId !== currentUserId) {
      throw new Error('Only the owner of the post comment can update it');
    }

    // Extract data from the updateCommentDto based on allowed keys
    const allowedUpdatingData = helper.extractDataFromObject(
      updateCommentDto,
      this.allowedUpdatingKeys,
    );

    // Get updated data for the comment
    const updatingCommentData = await this.getDataToUpdate(comment, allowedUpdatingData);

    // Update the comment using the repository
    const updatedComment = await postCommentRepository.update(
      tourPostId,
      postCommentId,
      updatingCommentData,
    );
    return helper.excludeDataFromObject(updatedComment) as PostComment;
  };

  /**
   * Transform dto to expected data which should be used to update.
   * Also, some kinds of data should be validated before updating.
   * @param comment
   * @param updatingCommentData
   */
  private async getDataToUpdate(
    comment: PostComment,
    updatingCommentData: Partial<UpdatePostCommentDto>,
  ): Promise<Partial<PostComment>> {
    // New data to update
    return {
      ...updatingCommentData,
      updatedAt: Date.now(),
    };
  }
}
