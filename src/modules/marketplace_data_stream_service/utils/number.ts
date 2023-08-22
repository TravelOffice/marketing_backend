import { PADDING_ZERO_PREFIX } from './constants';

export function padZeroToLeft(numberToPad: number, length: number) {
  const str = numberToPad.toString();
  return str.padStart(length, PADDING_ZERO_PREFIX);
}
