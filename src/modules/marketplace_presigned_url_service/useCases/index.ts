// TODO: Declare use cases which can be used in this service here

import CreateUserAvatarUrlUseCaseImpl from './CreateUserAvatarUrlUseCaseImpl';
import { CreateUserAvatarUrlUseCase } from './interfaces/CreateUserAvatarUrlUseCase';
import { CreateOrgThumbnailUrlUseCase } from './interfaces/CreateOrgThumbnailUrlUseCase';
import { CreatePostThumbnailUrlUseCase } from './interfaces/CreatePostThumbnaillUrlUseCase';
import CreateOrgThumbnailUrlUseCaseImpl from './CreateOrgThumbnailUrlUseCaseImpl';
import CreatePostThumbnailUrlUseCaseImpl from './CreatePostThumbnailUrlUseCaseImpl';

interface UseCases {
  createOrgThumbnailUrlUseCase: CreateOrgThumbnailUrlUseCase,
  createUserAvatarUrlUseCase: CreateUserAvatarUrlUseCase,
  createPostThumbnailUrlUseCase: CreatePostThumbnailUrlUseCase,
}

const useCases: UseCases = {
  createOrgThumbnailUrlUseCase: new CreateOrgThumbnailUrlUseCaseImpl(),
  createUserAvatarUrlUseCase: new CreateUserAvatarUrlUseCaseImpl(),
  createPostThumbnailUrlUseCase: new CreatePostThumbnailUrlUseCaseImpl(),
};

export const {
  createOrgThumbnailUrlUseCase,
  createUserAvatarUrlUseCase,
  createPostThumbnailUrlUseCase,
} = useCases;
