import { Estimation } from '../../models/Estimation';

export type CreateEstimationDto = Pick<Estimation,
  'name' |
  'supplierId' |
  'serviceType' |
  'estimatedPrice' |
  'estimatedQuantity' |
  'note' |
  'vat' |
  'vatStatus' |
  'payer'
>;
