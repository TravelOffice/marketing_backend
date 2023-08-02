import { CreateEstimationDto } from './CreateEstimationDto';

export type UpdateEstimationDto = Omit<CreateEstimationDto,
'supplierId' |
'serviceType'
>;
