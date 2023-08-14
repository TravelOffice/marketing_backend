import { BaseDdbModel } from 'common-models';

export interface MarketplaceUser extends BaseDdbModel {
    tenant: string, // Tenant ID
    username: string, // Username of the user in isolated tenant
    id: string, // Combination of tenant and username
    // Alias of the user.
    // This is the id that will be displayed in the UI instead of user id
    alias: string,
    name: string, // Full name of the user
    phone: string, // Phone number of the user
}
