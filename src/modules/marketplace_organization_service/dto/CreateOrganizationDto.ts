import { Organization } from '../models/Organization';

export type CreateOrganizationDto = Pick<Organization,
    'name' |
    'email' |
    'phoneNumber' |
    'address' |
    'profilePicture' |
    'employeesCount' |
    'foundedYear' |
    'website' |
    'socialMedia'
>;
