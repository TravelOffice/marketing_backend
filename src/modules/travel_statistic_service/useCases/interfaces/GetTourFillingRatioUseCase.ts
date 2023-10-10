import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { TourFillingRatioResponse } from '../../models/TourFillingRatioStatistic';

export interface GetTourFillingRatioUseCase {
  invoke(
    tenant: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<TourFillingRatioResponse> | undefined>;
}
