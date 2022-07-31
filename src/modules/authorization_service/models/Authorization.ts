export interface ClaimVerifyRequest {
  readonly token: string,
}

export interface CognitoUser {
  'cognito:username': string,
  'custom:role': string,
  email: string,
  phone_number: string,
  sub: string,
  email_verified: boolean,
}

export interface Claim extends CognitoUser {
  token_use: string,
  auth_time: number,
  iss: string,
  exp: number,
  client_id: string,
}

export interface ClaimVerifyResult {
  readonly claim: Claim,
}

export interface TokenHeader {
  kid: string,
  alg: string,
}
export interface PublicKey {
  alg: string,
  e: string,
  kid: string,
  kty: string,
  n: string,
  use: string,
}
export interface PublicKeyMeta {
  instance: PublicKey,
  pem: string,
}

export interface PublicKeys {
  keys: PublicKey[],
}

export interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta,
}
