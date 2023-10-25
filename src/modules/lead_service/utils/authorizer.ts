import jwtDecode from 'jwt-decode';

export function decodeToken(jwtToken: string) {
  return jwtDecode<any>(jwtToken);
}

export function getCurrentUserInfo(jwtToken: string) {
  const decoded = decodeToken(jwtToken);
  return {
    username: decoded['lambda1:username'],
    name: decoded.name,
  };
}
