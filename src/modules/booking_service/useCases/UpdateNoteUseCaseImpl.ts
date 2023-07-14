import { UpdateNoteUseCase } from './interfaces/UpdateNoteUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { UpdateNoteDto } from '../models/dto/UpdateNoteDto';
import { bookingRepository } from '../repositories';
import { Note } from '../models/Note';

export default class UpdateNoteUseCaseImpl implements UpdateNoteUseCase {
  /**
   * Invokes the function to update a note within a booking.
   *
   * @param currentUser - The current user invoking the function.
   * @param bookingId - The ID of the booking containing the note to be updated.
   * @param noteId - The ID of the note to update.
   * @param dto - The DTO (data transfer object) containing the data for the updated note.
   * @returns A Promise that resolves to the updated note.
   * @throws Error if the booking or note does not exist.
   */
  async invoke(currentUser: CognitoUser, bookingId: string, noteId: string, dto: UpdateNoteDto) {
    const { tenant } = currentUser;

    const booking = await bookingRepository.getByGivenId(tenant, bookingId);
    if (!booking) throw new Error('Booking not found.');

    const { notes } = booking;
    const currentNote = notes?.find((n) => n.id === noteId);

    if (!currentNote) throw new Error('Note not found.');

    const newNote: Note = { ...currentNote, ...dto, updatedAt: Date.now() };
    const newNotes = notes?.map((note) => (note.id === noteId ? newNote : note));
    await bookingRepository.update(tenant, bookingId, { notes: newNotes });
    return newNote;
  }
}
