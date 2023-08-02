import { helper } from 'core';
import { CognitoUser } from '../../models/CognitoUser';
import { Estimation } from '../../models/Estimation';
import { estimationRepository, tourOperationRepository } from '../../repositories';
import { UpdateEstimationUseCase } from '../../repositories/interfaces/estimation/UpdateEstimationUseCase';
import { UpdateEstimationDto } from '../../dto/estimation/UpdateEstimationDto';

export default class UpdateEstimationUseCaseImpl implements UpdateEstimationUseCase {
  private allowedUpdatingKeys: (keyof UpdateEstimationDto)[] = [
    'name',
    'estimatedPrice',
    'estimatedQuantity',
    'note',
    'vat',
    'vatStatus',
    'payer',
  ];

  /**
   * Invokes the UpdateEstimationUseCase to update an estimation.
   *
   * @param currentUser - The current user invoking the use case.
   * @param tourId - The operation tour ID
   * @param estimationId - The ID of the estimation to update.
   * @param updateEstimationDto - The DTO (data transfer object) containing the
   * updated estimation data.
   * @returns A Promise that resolves to the updated estimation.
   * @throws Error if the estimation with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    tourId: string,
    estimationId: string,
    updateEstimationDto: UpdateEstimationDto,
  ): Promise<Estimation> {
    const { tenant, username } = currentUser;
    const departureTour = await tourOperationRepository.get(tenant, tourId);
    if (!departureTour) throw new Error(`Could not found tour with code ${tourId}`);
    if (departureTour.assigneeId !== username) throw new Error('You are not the designated tour operator for this tour');

    const currentEstimation = await estimationRepository.get(tenant, tourId, estimationId);
    if (!currentEstimation) throw new Error(`Could not found estimation ${estimationId}`);

    const dataToUpdate = await this.buildDataToUpdate({
      currentEstimation, currentUser, estimationId, updateEstimationDto,
    });

    const estimation = await estimationRepository.update(
      currentUser.tenant,
      tourId,
      estimationId,
      dataToUpdate,
    );
    return helper.excludeDataFromObject(estimation) as Estimation;
  }

  /**
   * Builds the data to update based on the provided options.
   *
   * @param options - The options for building the data to update.
   * @returns A Promise that resolves to the partial estimation data to update.
   */
  async buildDataToUpdate(options: {
    currentUser: CognitoUser,
    estimationId: string,
    currentEstimation: Estimation,
    updateEstimationDto: UpdateEstimationDto,
  }): Promise<Partial<Estimation>> {
    const { currentEstimation, updateEstimationDto } = options;
    const now = Date.now();
    let dataToUpdate: Partial<Estimation> = {};
    const updateEstimation = helper.extractDataFromObject(
      updateEstimationDto,
      this.allowedUpdatingKeys,
    );
    const props = Object.keys(updateEstimation);
    props.forEach((key) => {
      const prop = key as keyof UpdateEstimationDto;
      if (currentEstimation[prop] !== updateEstimationDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateEstimationDto[prop] };
      }
    });
    dataToUpdate.updatedAt = now;

    return dataToUpdate;
  }
}
