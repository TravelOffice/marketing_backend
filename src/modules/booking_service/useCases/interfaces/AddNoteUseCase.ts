import { AddNoteDto } from '../../models/dto/AddNoteDto';
import { Note } from '../../models/Note';
import { CognitoUser } from '../../models/CognitoUser';

export interface AddNoteUseCase {
  invoke: (currentUser: CognitoUser, bookingId: string, dto: AddNoteDto) => Promise<Note>,
}
