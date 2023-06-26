export interface CognitoUserRepository {
  getCognitoUserAttributes: (userId: string) => Promise<Map<string, string> | undefined>,
}
