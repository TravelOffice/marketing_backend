// TODO: Declare repository objects which can be used in this service here

import PostCommentRepositoryImpl from './PostCommentRepositoryImpl';
import { PostCommentRepository } from './interfaces/PostCommentRepository';
import { MarketplaceUserRepository } from './interfaces/MarketplaceUserRepository';
import MarketplaceUserRepositoryImpl from './MarketplaceUserRepositoryImpl';

interface Repositories {
  postCommentRepository: PostCommentRepository,
  marketplaceUserRepository: MarketplaceUserRepository,
}

const repositories: Repositories = {
  postCommentRepository: new PostCommentRepositoryImpl(),
  marketplaceUserRepository: new MarketplaceUserRepositoryImpl(),
};

export const {
  postCommentRepository,
  marketplaceUserRepository,
} = repositories;
