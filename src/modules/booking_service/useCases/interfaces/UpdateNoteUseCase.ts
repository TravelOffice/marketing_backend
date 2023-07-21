import { CognitoUser } from '../../models/CognitoUser';
import { Note } from '../../models/Note';
import { UpdateNoteDto } from '../../models/dto/UpdateNoteDto';

export interface UpdateNoteUseCase {
  invoke: (
    currentUser: CognitoUser,
    bookingId: string,
    noteId: string,
    dto: UpdateNoteDto,
  ) => Promise<Note>,
}
