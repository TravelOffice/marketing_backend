import { CognitoUser } from '../../models/CognitoUser';

export interface DeleteNoteUseCase {
  invoke: (currentUser: CognitoUser, bookingId: string, noteId: string) => Promise<void>,
}
