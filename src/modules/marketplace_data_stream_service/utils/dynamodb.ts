import {
  OFFER_INDEX, ORGANIZATION_INDEX, POST_INDEX, RATING_INDEX,
} from './constants';

export function isTourPost(pk: string): boolean {
  return pk === POST_INDEX;
}

export function isOrganization(pk: string): boolean {
  return pk === ORGANIZATION_INDEX;
}

export function isTourPostOffer(pk: string): boolean {
  return pk === OFFER_INDEX;
}

export function isTourPostRating(pk: string): boolean {
  const regex = new RegExp(`^${ORGANIZATION_INDEX}#.*#${RATING_INDEX}$`);
  return regex.test(pk);
}
