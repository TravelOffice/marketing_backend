import jwtDecode from 'jwt-decode';

const USERNAME_DELIMITER = "#";

export function decodeToken(jwtToken: string) {
  return jwtDecode<any>(jwtToken);
}

/**
 * Method to get current user information decoded from Cognito token
 * The format of cognito tenant id as following:
 *  - Tenant root user: username
 *  - Tenant employee id: tenantName#username
 *  EX: Tenant root user: pys
 *      Tenant employee user: pys#binhnv
 *      Invalid username: pys#binhnv#xxxx
 * To get the user information, there are steps need to do:
 * - Step 1: Decode the authorization token
 * - Step 2: Get the cognitoUsername of the authenticated user
 * - Step 3: Check whether the cognito username follow rule or not
 * - Step 4: Check whether the user is a root tenant user or not
 * - Step 5: Return the user information
 * @param jwtToken The authorization token of the authenticated user
 * @returns All information of the authenticated user
 */
export function getCurrentUserInfo(jwtToken: string) {
  const decoded = decodeToken(jwtToken);
  const cognitoUsername: string = decoded['cognito:username'];
  const usernameArr = cognitoUsername.split(USERNAME_DELIMITER);

  if(usernameArr.length > 2) throw new Error('The authenticated username invalid!');

  return {
    username: usernameArr.length === 1 ? usernameArr[0] : usernameArr[1],
    name: decoded.name,
  };
}
