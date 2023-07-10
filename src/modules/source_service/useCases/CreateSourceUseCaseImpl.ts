import { helper } from 'core';
import { Source } from '../models/Source';
import { sourceRepository } from '../repositories';
import { CreateSourceUseCase } from './interfaces/CreateSourceUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { CreateSourceDto } from '../dto/CreateSourceDto';

/**
 * Implementation of the CreateSourceUseCase.
 */
export default class CreateSourceUseCaseImpl implements CreateSourceUseCase {
  /**
   * Invokes the CreateSourceUseCase to create a source.
   *
   * @param currentUser - The current user invoking the use case.
   * @param createSourceDto - The DTO (data transfer object) containing the data for
   * creating the source.
   * @returns A Promise that resolves to the created source.
   */
  async invoke(currentUser: CognitoUser, createSourceDto: CreateSourceDto): Promise<Source> {
    const dataToCreate = await this.buildSource({ currentUser, createSourceDto });
    const source = await sourceRepository.create(currentUser.tenant, dataToCreate);
    return helper.excludeDataFromObject(source) as Source;
  }

  /**
   * Builds the source object using the provided options.
   *
   * @param options - The options for building the source.
   * @returns A Promise that resolves to the built source.
   */
  private async buildSource(options: {
    currentUser: CognitoUser,
    createSourceDto: CreateSourceDto,
  }): Promise<Source> {
    const now = Date.now();
    const { currentUser, createSourceDto } = options;
    return {
      code: await sourceRepository.generateSourceCode(currentUser.tenant),
      name: createSourceDto.name,
      createdAt: now,
      updatedAt: now,
    };
  }
}
