import {
  BOOKING_INDEX,
  LEAD_INDEX,
  TENANT_INDEX,
} from './constants';

export function isBooking(pk: string): boolean {
  const regex = new RegExp(`^${TENANT_INDEX}#.*#${BOOKING_INDEX}$`);
  return regex.test(pk);
}

export function isLead(pk: string): boolean {
  const regex = new RegExp(`^${TENANT_INDEX}#.*#${LEAD_INDEX}$`);
  return regex.test(pk);
}
