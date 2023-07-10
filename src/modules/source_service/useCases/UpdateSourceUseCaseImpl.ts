import { helper } from 'core';
import { Source } from '../models/Source';
import { UpdateSourceUseCase } from './interfaces/UpdateSourceUseCase';
import { UpdateSourceDto } from '../dto/UpdateSourceDto';
import { sourceRepository } from '../repositories';
import { CognitoUser } from '../models/CognitoUser';

export default class UpdateSourceUseCaseImpl implements UpdateSourceUseCase {
  /**
   * Invokes the UpdateSourceUseCase to update a source.
   *
   * @param currentUser - The current user invoking the use case.
   * @param sourceId - The ID of the source to update.
   * @param updateSourceDto - The DTO (data transfer object) containing the updated source data.
   * @returns A Promise that resolves to the updated source.
   * @throws Error if the source with the specified ID is not found.
   */
  async invoke(
    currentUser: CognitoUser,
    sourceId: string,
    updateSourceDto: UpdateSourceDto,
  ): Promise<Source> {
    const currentSource = await sourceRepository.get(currentUser.tenant, sourceId);
    if (!currentSource) throw new Error(`Could not found source ${sourceId}`);
    const dataToUpdate = await this.buildDataToUpdate({
      currentSource, currentUser, sourceId, updateSourceDto,
    });
    const source = await sourceRepository.update(currentUser.tenant, sourceId, dataToUpdate);
    return helper.excludeDataFromObject(source) as Source;
  }

  /**
   * Builds the data to update based on the provided options.
   *
   * @param options - The options for building the data to update.
   * @returns A Promise that resolves to the partial source data to update.
   */
  async buildDataToUpdate(options: {
    currentUser: CognitoUser,
    sourceId: string,
    currentSource: Source,
    updateSourceDto: UpdateSourceDto,
  }): Promise<Partial<Source>> {
    const { currentSource, updateSourceDto } = options;
    const now = Date.now();
    let dataToUpdate: Partial<Source> = {};
    const props = Object.keys(updateSourceDto);
    props.forEach((key) => {
      const prop = key as keyof UpdateSourceDto;
      if (currentSource[prop] !== updateSourceDto[prop]) {
        dataToUpdate = { ...dataToUpdate, [prop]: updateSourceDto[prop] };
      }
    });
    dataToUpdate.updatedAt = now;

    return dataToUpdate;
  }
}
