import { helper } from 'core';
import { sourceRepository } from '../repositories';
import { GetSourceUseCase } from './interfaces/GetSourceUseCase';
import { Source } from '../models/Source';
import { CognitoUser } from '../models/CognitoUser';

export default class GetSourceUseCaseImpl implements GetSourceUseCase {
  /**
   * Invokes the DeleteSourceUseCase to delete a source.
   *
   * @param currentUser - The current user invoking the use case.
   * @param sourceId - The ID of the source to retrieve.
   * @returns A Promise that resolves to the retrieved source, or undefined if not found.
   */
  async invoke(currentUser: CognitoUser, sourceId: string): Promise<Source|undefined> {
    const source = await sourceRepository.get(currentUser.tenant, sourceId);
    if (!source) return undefined;
    return helper.excludeDataFromObject(source) as Source;
  }
}
