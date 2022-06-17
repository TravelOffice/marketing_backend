import { Note } from '../models/Note';
import { NoteRepository } from './interfaces/NoteRepository';

export default class NoteRepositoryImpl implements NoteRepository {
  /**
   * Generate notes data before save to dynamodb
   * @param tasks List of notek
   * @param creatorId Id of creator
   * @param creatorName Name of creator
   * @returns List of note after   generating data
   */
  generateData = (notes: Note[], creatorId: string, creatorName: string): Note[] => {
    const newNotes: Note[] = notes.map((note) => (
      {
        ...note,
        creatorId: note.creatorId ? note.creatorId : creatorId,
        creatorName: note.creatorName ? note.creatorName : creatorName,
        createdAt: note.createdAt ? note.createdAt : Date.now(),
      }
    ));
    return newNotes;
  };
}
