import { Source } from '../../models/Source';
import { CognitoUser } from '../../models/CognitoUser';
import { CreateSourceDto } from '../../dto/CreateSourceDto';

export interface CreateSourceUseCase {
  invoke(currentUser: CognitoUser, createSourceDto: CreateSourceDto): Promise<Source>,
}
