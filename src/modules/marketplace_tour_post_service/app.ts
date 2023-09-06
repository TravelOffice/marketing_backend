import compression from 'compression';
import cors from 'cors';
import { getMarketplaceUserInfo } from 'decode-token';
import express, { NextFunction, Request, Response } from 'express';
import { TourPost } from './models/TourPost';
import {
  bookmarkTourPostUseCase,
  createTourPostUseCase,
  followTourPostUseCase,
  getBookmarkedTourPostsUseCase,
  getFollowedTourPostsUseCase,
  getLinkedLeadOrTourInfoOnMarketplaceUseCase,
  getSelfTourPostListByUserUseCase,
  getTopCommissionPostsUseCase,
  getTourPostListByOrgUseCase,
  getTourPostListByUserUseCase,
  getTourPostListUseCase,
  getTourPostUseCase,
  unbookmarkTourPostUseCase,
  unfollowTourPostUseCase,
  updateTourPostUseCase,
} from './useCases';
import { FAILED, SUCCESS } from './utils/constants';
import logger from './utils/logger';
import validate, {
  bookmarkPostValidator,
  createTourPostValidator,
  followPostValidator,
  getBookmarkedOrFollowedPostsValidator,
  getPostsValidator,
  getSelfPostsValidator,
  getTopTrendingTourValidator,
  getTourPostValidator,
  idParamValidator,
  updateTourPostValidator,
} from './utils/validator';
import wrapResponse from './utils/wrapResponse';

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', ['*']);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.log(`Request to ${req.method}: ${req.url}`);
  next();
});

app.get('/marketplace/me/posts', getSelfPostsValidator(), async (req: Request, res: Response) => {
  validate(req);
  try {
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPosts = await getSelfTourPostListByUserUseCase.invoke(
      currentUser,
      req.query,
    );
    logger.log(`[app.get] Get posts of current user successfully ${JSON.stringify(tourPosts)}`);
    res.json(wrapResponse(SUCCESS, tourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts', getPostsValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    // The posts can be get by organization
    // If organization is not specified, get all posts
    const { organization, author, ...paginationParams } = req.query;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    let tourPosts;
    if (organization) {
      // Fetch posts by organization
      tourPosts = await getTourPostListByOrgUseCase.invoke(
        currentUser,
        organization as string,
        paginationParams,
      );
      logger.log(`[app.get] Get posts by organization ${organization} successfully ${JSON.stringify(tourPosts)}`);
    } else if (author) {
      // Fetch posts by author
      tourPosts = await getTourPostListByUserUseCase.invoke(
        currentUser,
        author as string,
        paginationParams,
      );
      logger.log(`[app.get] Get posts by author ${author} successfully ${JSON.stringify(tourPosts)}`);
    } else {
      // Fetch all posts
      tourPosts = await getTourPostListUseCase.invoke(currentUser, paginationParams);
      logger.log(`[app.get] Get all posts successfully ${JSON.stringify(tourPosts)}`);
    }
    res.json(wrapResponse(SUCCESS, tourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts/:id', getTourPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPost = await getTourPostUseCase.invoke(id, currentUser);
    logger.log(`[app.get] Get post ${id} successfully ${JSON.stringify(tourPost)}`);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts', createTourPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPost = await createTourPostUseCase.invoke(currentUser, req.body);
    logger.log(`[app.post] Create post successfully ${JSON.stringify(tourPost)}`);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.put('/marketplace/posts/:id', updateTourPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPost = await updateTourPostUseCase.invoke(currentUser, id, req.body);
    logger.log(`[app.put] Update post ${id} successfully ${JSON.stringify(tourPost)}`);
    res.json(wrapResponse(SUCCESS, tourPost));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me/bookmarked-posts', getBookmarkedOrFollowedPostsValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    // Get bookmarked posts of current user
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPosts = await getBookmarkedTourPostsUseCase.invoke(
      currentUser,
      req.query,
    );
    logger.log(`[app.get] Get bookmarked posts of current user ${currentUser} successfully ${JSON.stringify(tourPosts)}`);
    res.json(wrapResponse(SUCCESS, tourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/me/followed-posts', getBookmarkedOrFollowedPostsValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    // Get followed posts of current user
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const tourPosts = await getFollowedTourPostsUseCase.invoke(
      currentUser,
      req.query,
    );
    logger.log(`[app.get] Get followed posts of current user ${currentUser} successfully ${JSON.stringify(tourPosts)}`);
    res.json(wrapResponse(SUCCESS, tourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts/:id/bookmark', bookmarkPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: postId } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const bookmarkedItem = await bookmarkTourPostUseCase.invoke(currentUser, postId);
    logger.log(`[app.get] Bookmark post ${postId} successfully ${JSON.stringify(bookmarkedItem)}`);
    res.json(wrapResponse(SUCCESS, bookmarkedItem));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/posts/:id/bookmark', bookmarkPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: postId } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    await unbookmarkTourPostUseCase.invoke(currentUser, postId);
    logger.log(`[app.get] Unbookmark post ${postId} for user ${currentUser} successfully`);
    res.json(wrapResponse(SUCCESS, undefined));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.post('/marketplace/posts/:id/follow', followPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: postId } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    const bookmarkedItem = await followTourPostUseCase.invoke(currentUser, postId);
    logger.log(`[app.get] Follow post ${postId} successfully ${JSON.stringify(bookmarkedItem)}`);
    res.json(wrapResponse(SUCCESS, bookmarkedItem));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.delete('/marketplace/posts/:id/follow', followPostValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { id: postId } = req.params;
    const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
    await unfollowTourPostUseCase.invoke(currentUser, postId);
    logger.log(`[app.get] Unfollow post ${postId} for user ${currentUser} successfully`);
    res.json(wrapResponse(SUCCESS, undefined));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get('/marketplace/posts/trending', getTopTrendingTourValidator(), async (req: Request, res: Response) => {
  try {
    validate(req);
    const { topCount } = req.query;
    let topCommissionTourPosts: TourPost[];
    if (topCount) {
      topCommissionTourPosts = await getTopCommissionPostsUseCase
        .invoke(parseInt(topCount as string, 10));
    } else {
      topCommissionTourPosts = await getTopCommissionPostsUseCase.invoke();
    }
    logger.log(`[app.get] Get top commission tour posts successfully ${JSON.stringify(topCommissionTourPosts)}`);
    res.json(wrapResponse(SUCCESS, topCommissionTourPosts));
  } catch (error: any) {
    logger.log(`[app.get] Error ${error}`);
    res.json(wrapResponse(FAILED, undefined, error.message));
  }
});

app.get(
  '/marketplace/posts/linked-target-info/:id',
  idParamValidator(),
  async (req: Request, res: Response) => {
    try {
      validate(req);
      const { id } = req.params;
      const currentUser = getMarketplaceUserInfo(req.headers.authorization!);
      const tourPostInfoLinkedToTarget = await getLinkedLeadOrTourInfoOnMarketplaceUseCase
        .invoke(currentUser, id);
      res.json(wrapResponse(SUCCESS, tourPostInfoLinkedToTarget));
    } catch (error: any) {
      logger.log(`[app.get] Error ${error}`);
      res.json(wrapResponse(FAILED, undefined, error.message));
    }
  },
);

export default app;
