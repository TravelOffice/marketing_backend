import { helper } from 'core';
import { CognitoUser } from '../../models/CognitoUser';
import { Estimation } from '../../models/Estimation';
import { estimationRepository, supplierRepository, tourOperationRepository } from '../../repositories';
import { CREATED_AT_INDEX, CREATOR_INDEX, UPDATED_AT_INDEX } from '../../utils/constants';
import { CreateEstimationUseCase } from '../../repositories/interfaces/estimation/CreateEstimationUseCase';
import { CreateEstimationDto } from '../../dto/estimation/CreateEstimationDto';

export default class CreateEstimationUseCaseImpl implements CreateEstimationUseCase {
  /**
   * Invokes the CreateEstimationUseCase to create an estimation.
   *
   * @param currentUser - The current user invoking the use case.
   * @param tourId - The departure tour id which contain estimation
   * @param createEstimationDto - The DTO (data transfer object) containing the data for
   * creating the estimation.
   * @returns A Promise that resolves to the created estimation.
   */
  async invoke(
    currentUser: CognitoUser,
    tourId: string,
    createEstimationDto: CreateEstimationDto,
  ): Promise<Estimation> {
    const { tenant, username } = currentUser;
    const dataToCreate = await this.buildEstimation({ currentUser, tourId, createEstimationDto });
    const departureTour = await tourOperationRepository.get(tenant, tourId);
    if (!departureTour) throw new Error(`Could not found tour with code ${tourId}`);
    if (departureTour.assigneeId !== username) throw new Error('You are not the designated tour operator for this tour');

    const supplier = await supplierRepository.get(tenant, dataToCreate.supplierId);
    if (!supplier) throw new Error(`Could not found supplier with code ${dataToCreate.supplierId}`);
    if (!supplier.services.includes(dataToCreate.serviceType)) throw new Error(`Could not found service ${dataToCreate.serviceType} in supplier ${dataToCreate.supplierId}`);

    const estimation = await estimationRepository.create(tenant, tourId, dataToCreate);
    return helper.excludeDataFromObject(estimation) as Estimation;
  }

  /**
   * Builds the estimation object using the provided options.
   *
   * @param options - The options for building the estimation.
   * @returns A Promise that resolves to the built estimation.
   */
  private async buildEstimation(options: {
    currentUser: CognitoUser,
    tourId: string,
    createEstimationDto: CreateEstimationDto,
  }): Promise<Estimation> {
    const now = Date.now();
    const { currentUser, createEstimationDto, tourId } = options;
    const { username: creatorId, name: creatorName } = currentUser;
    return {
      code: await estimationRepository.generateId(currentUser.tenant, tourId),
      name: createEstimationDto.name,
      tourId,
      supplierId: createEstimationDto.supplierId,
      serviceType: createEstimationDto.serviceType,
      estimatedPrice: createEstimationDto.estimatedPrice,
      estimatedQuantity: createEstimationDto.estimatedQuantity,
      note: createEstimationDto.note,
      payer: createEstimationDto.payer,
      actualPrice: 0,
      actualQuantity: 0,
      vat: createEstimationDto.vat,
      vatStatus: createEstimationDto.vatStatus,
      createdAt: now,
      updatedAt: now,
      creatorId,
      creatorName,
      lsi1: `${CREATED_AT_INDEX}#${now}`, // createdAt lsi
      lsi2: `${UPDATED_AT_INDEX}#${now}`, // updatedAt lsi
      lsi4: `${CREATOR_INDEX}#${creatorId}`, // creatorId lsi
    };
  }
}
