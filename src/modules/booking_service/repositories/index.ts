import BookingRepositoryImpl from './BookingRepositoryImpl';
import { BookingRepository } from './interfaces/BookingRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  bookingRepository: BookingRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  bookingRepository: new BookingRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  bookingRepository,
  userRepository,
} = repositories;
