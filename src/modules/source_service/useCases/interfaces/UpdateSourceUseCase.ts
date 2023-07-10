import { Source } from '../../models/Source';
import { UpdateSourceDto } from '../../dto/UpdateSourceDto';
import { CognitoUser } from '../../models/CognitoUser';

export interface UpdateSourceUseCase {
  invoke(
    currentUser: CognitoUser,
    sourceId: string,
    updateSourceDto: UpdateSourceDto,
  ): Promise<Source>,
}
