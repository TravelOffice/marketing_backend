import { OFFER_INDEX, ORGANIZATION_INDEX, POST_INDEX } from './constants';

export function isTourPost(pk: string): boolean {
  return pk.startsWith(POST_INDEX);
}

export function isOrganization(pk: string): boolean {
  return pk.startsWith(ORGANIZATION_INDEX);
}

export function isTourPostOffer(pk: string): boolean {
  const regExp = new RegExp(`^${ORGANIZATION_INDEX}.*${OFFER_INDEX}$`);
  return regExp.test(pk);
}
