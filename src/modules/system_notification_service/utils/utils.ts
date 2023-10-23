import { getCurrentUserInfo, getMarketplaceUserInfo } from 'decode-token';
import { AppType } from '../models/UserDeviceSession';

export function getUserInfoByAppType(appType: AppType, jwtToken: string) {
  let currentUser;
  if (appType === 'MARKETPLACE') {
    currentUser = getMarketplaceUserInfo(jwtToken);
  } else if (appType === 'TRAVEL') {
    currentUser = getCurrentUserInfo(jwtToken);
  }
  if (!currentUser) {
    throw new Error(`Application type ${appType} isn't supported`);
  }

  return currentUser;
}
