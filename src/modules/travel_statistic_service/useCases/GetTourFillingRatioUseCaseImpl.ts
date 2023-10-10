import { PaginationParams, PaginationResponsePayload } from 'core/providers/dynamodb/DynamoProvider';
import { tenantStatisticRepository } from '../repositories';
import { GetTourFillingRatioUseCase } from './interfaces/GetTourFillingRatioUseCase';
import { TourFillingRatioResponse } from '../models/TourFillingRatioStatistic';

export default class GetTourFillingRatioUseCaseImpl
implements GetTourFillingRatioUseCase {
  invoke = async (
    tenant: string,
    paginationParams: PaginationParams,
  ): Promise<PaginationResponsePayload<TourFillingRatioResponse> | undefined> => {
    const result = await tenantStatisticRepository.getFillingRatioStatistic(
      tenant,
      paginationParams,
    );

    if (result) {
      return {
        ...result,
        data: result?.data.map((item) => ({
          departureTourId: item.sk,
          departureTourName: item.dtN,
          fillingRatio: Number(item.lsi1),
        })),
      };
    }

    return undefined;
  };
}
