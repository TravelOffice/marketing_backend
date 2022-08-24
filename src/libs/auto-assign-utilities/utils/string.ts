// eslint-disable-next-line max-len,no-bitwise
const stringToHash = (s: string) => s.split('').reduce((a, b) => (((a << 5) - a) + b.charCodeAt(0)) | 0, 0).toString();

export default stringToHash;
