import { DynamoDBRecord } from 'aws-lambda';
import { OnMarketplaceDataStreamed } from './interfaces/OnMarketplaceDataStreamed';
import logger from '../utils/logger';

export default class OnMarketplaceDataStreamedImpl implements OnMarketplaceDataStreamed {
  invoke = async (dataRecords: DynamoDBRecord[]) => {
    logger.log(dataRecords);
    return undefined;
  };
}
