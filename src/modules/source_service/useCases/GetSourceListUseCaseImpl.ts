import { helper } from 'core';
import { sourceRepository } from '../repositories';
import { GetSourceListUseCase } from './interfaces/GetSourceListUseCase';
import { Source } from '../models/Source';
import { CognitoUser } from '../models/CognitoUser';

export default class GetSourceListUseCaseImpl implements GetSourceListUseCase {
  /**
   * Invokes the DeleteSourceUseCase to delete a source.
   *
   * @param currentUser - The current user invoking the use case.
   * @returns A Promise that resolves to an array of sources.
   */
  async invoke(currentUser: CognitoUser): Promise<Array<Source>> {
    const sources = await sourceRepository.list(currentUser.tenant);
    return sources.map((source) => helper.excludeDataFromObject(source) as Source);
  }
}
