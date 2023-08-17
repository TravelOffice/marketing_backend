import { MarketplaceUser } from '../models';

export type UpdateUserDto = Pick<
  MarketplaceUser,
  'alias' |
  'description' |
  'avatar' |
  'settings'
>;
