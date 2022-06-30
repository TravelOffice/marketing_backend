import { User } from '../models/User';

export function toUserAttributeName(name: string): string {
  switch (name) {
    case 'firstName': return 'given_name';
    case 'lastName': return 'family_name';
    case 'phoneNumber': return 'phone_number';
    case 'role': return 'custom:role';
    default: return name;
  }
}

export function toUserAttributes(user: Partial<User>): Array<any> {
  const userAttributes : Array<any> = [];
  Object.entries(user).forEach((userValue) => {
    const [name, value] = userValue;
    if (name && name !== 'username' && value) {
      userAttributes.push({
        Name: toUserAttributeName(name),
        Value: value,
      });
    }
  });
  return userAttributes;
}
