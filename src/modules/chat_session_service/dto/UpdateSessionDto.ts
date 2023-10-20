import { Session } from '../models/Session';

export type UpdateSessionDto = Pick<Session, 'latestMessage'>;
