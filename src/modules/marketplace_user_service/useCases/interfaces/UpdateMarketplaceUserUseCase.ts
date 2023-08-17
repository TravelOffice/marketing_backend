import { MarketplaceUser } from '../../models';
import { UpdateUserDto } from '../../dto/UpdateUserDto';

export interface UpdateMarketplaceUserUseCase {
  invoke: (
    tenant: string,
    username: string,
    updateUserDto: UpdateUserDto
  ) => Promise<MarketplaceUser>;
}
