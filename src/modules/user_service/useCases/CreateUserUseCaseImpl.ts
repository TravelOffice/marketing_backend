import { User } from '../models/User';
import { userRepository } from '../repositories';
import { CreateUserUseCase } from './interfaces/CreateUserUseCase';

export default class CreateUserUseCaseImpl implements CreateUserUseCase {
  invoke = async (user: User) => userRepository.create(user);
}
