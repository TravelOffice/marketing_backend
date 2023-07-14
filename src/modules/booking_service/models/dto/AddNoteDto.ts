import { Note } from '../Note';

export type AddNoteDto = Pick<Note,
  'title' |
  'type' |
  'description'
>
