import { DynamoDBRecord } from 'aws-lambda';
import { MarketplaceStatistic } from '../../models/statistic/MarketplaceStatistic';

export interface OnMarketplaceDataStreamed {
  invoke(dataRecords: DynamoDBRecord[]): Promise<MarketplaceStatistic | undefined>;
}
