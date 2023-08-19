import { marketplaceStatisticRepository } from '../repositories';
import { GetMarketplaceStatisticUseCase } from './interfaces/GetMarketplaceStatisticUseCase';

export default class GetMarketplaceStatisticUseCaseImpl implements GetMarketplaceStatisticUseCase {
  invoke = async () => marketplaceStatisticRepository.getMarketplaceStatistic();
}
