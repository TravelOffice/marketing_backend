import jwtDecode from 'jwt-decode';

export function decodeToken(jwtToken: string) {
  return jwtDecode<any>(jwtToken);
}

export function getCurrentUserId(jwtToken: string) {
  const decoded = decodeToken(jwtToken);
  return decoded['cognito:username'];
}