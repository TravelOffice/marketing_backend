import { Note } from '../../models/Note';

export interface NoteRepository {
  generateData: (notes: Note[], creatorId: string, creatorName: string) => Note[]
}
