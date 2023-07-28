import { Estimation } from '../../Estimation';

export type CreateEstimationDto = Pick<Estimation,
'name' |
'tourId' |
'supplierId' |
'supplierService' |
'estimatedPrice' |
'estimatedQuantity' |
'note' |
'vat' |
'vatStatus' |
'payer'
>;
