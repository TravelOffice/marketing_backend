import SaleDistributionProvider from './SaleDistributionProvider';

interface Providers {
  saleDistributionProvider: SaleDistributionProvider,
}

const providers: Providers = {
  saleDistributionProvider: new SaleDistributionProvider(),
};

export const {
  saleDistributionProvider,
} = providers;
