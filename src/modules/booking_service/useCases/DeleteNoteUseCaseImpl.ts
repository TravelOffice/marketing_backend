import { DeleteNoteUseCase } from './interfaces/DeleteNoteUseCase';
import { CognitoUser } from '../models/CognitoUser';
import { bookingRepository } from '../repositories';

export default class DeleteNoteUseCaseImpl implements DeleteNoteUseCase {
  /**
   * Invokes the function to delete a note from a booking.
   *
   * @param currentUser - The current user invoking the function.
   * @param bookingId - The ID of the booking containing the note to be deleted.
   * @param noteId - The ID of the note to be deleted.
   * @throws Error if the booking or note does not exist.
   */
  async invoke(currentUser: CognitoUser, bookingId: string, noteId: string) {
    const { tenant } = currentUser;
    const booking = await bookingRepository.getByGivenId(tenant, bookingId);

    if (!booking) throw new Error('Booking not found.');

    const { notes } = booking;
    const currentNote = notes?.find((note) => note.id === noteId);
    if (!currentNote) throw new Error('Note not found.');

    const newNotes = notes?.filter((note) => note.id !== noteId);
    await bookingRepository.update(tenant, bookingId, { notes: newNotes });
  }
}
