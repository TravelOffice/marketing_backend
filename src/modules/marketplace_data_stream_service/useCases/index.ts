import OnMarketplaceDataStreamedImpl from './OnMarketplaceDataStreamedImpl';
import { OnMarketplaceDataStreamed } from './interfaces/OnMarketplaceDataStreamed';

interface UseCases {
  onMarketplaceDataStreamed: OnMarketplaceDataStreamed,
}

const useCases: UseCases = {
  onMarketplaceDataStreamed: new OnMarketplaceDataStreamedImpl(),
};

export const {
  onMarketplaceDataStreamed,
} = useCases;
