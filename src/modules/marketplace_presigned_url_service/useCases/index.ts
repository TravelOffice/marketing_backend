// TODO: Declare use cases which can be used in this service here

import CreateUserAvatarUrlUseCaseImpl from './CreateUserAvatarUrlUseCaseImpl';
import { CreateUserAvatarUrlUseCase } from './interfaces/CreateUserAvatarUrlUseCase';
import { CreatePostThumbnailUrlUseCase } from './interfaces/CreatePostThumbnaillUrlUseCase';
import CreatePostThumbnailUrlUseCaseImpl from './CreatePostThumbnailUrlUseCaseImpl';
import CreateOrgProfilePictureUrlUseCaseImpl from './CreateOrgProfilePictureUrlUseCaseImpl';
import { CreateOrgProfilePictureUrlUseCase } from './interfaces/CreateOrgProfilePictureUrlUseCase';

interface UseCases {
  createOrgProfilePictureUrlUseCase: CreateOrgProfilePictureUrlUseCase,
  createUserAvatarUrlUseCase: CreateUserAvatarUrlUseCase,
  createPostThumbnailUrlUseCase: CreatePostThumbnailUrlUseCase,
}

const useCases: UseCases = {
  createOrgProfilePictureUrlUseCase: new CreateOrgProfilePictureUrlUseCaseImpl(),
  createUserAvatarUrlUseCase: new CreateUserAvatarUrlUseCaseImpl(),
  createPostThumbnailUrlUseCase: new CreatePostThumbnailUrlUseCaseImpl(),
};

export const {
  createOrgProfilePictureUrlUseCase,
  createUserAvatarUrlUseCase,
  createPostThumbnailUrlUseCase,
} = useCases;
