import { AddNoteUseCase } from './interfaces/AddNoteUseCase';
import { AddNoteDto } from '../models/dto/AddNoteDto';
import { CognitoUser } from '../models/CognitoUser';
import { Note } from '../models/Note';
import { bookingRepository } from '../repositories';

export default class AddNoteUseCaseImpl implements AddNoteUseCase {
  /**
   * Invokes the function to add a note to a booking.
   *
   * @param currentUser - The current user invoking the function.
   * @param bookingId - The ID of the booking to add the note to.
   * @param dto - The DTO (data transfer object) containing the data for the new note.
   * @returns A Promise that resolves to the added note.
   * @throws Error if the booking does not exist.
   */
  invoke = async (currentUser: CognitoUser, bookingId: string, dto: AddNoteDto) => {
    const booking = await bookingRepository.getByGivenId(currentUser.tenant, bookingId);

    if (!booking) throw new Error('Booking not found.');

    const now = Date.now();
    const note: Note = {
      ...dto,
      id: now.toString(),
      createdAt: now,
      updatedAt: now,
      creatorId: currentUser.username,
      creatorName: currentUser.name,
    };

    const { notes } = booking;
    const newNotes = notes ? notes.concat([note]) : [note];
    await bookingRepository.update(currentUser.tenant, bookingId, { notes: newNotes });
    return note;
  };
}
