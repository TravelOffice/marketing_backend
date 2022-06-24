import { User } from '../models/User';
import { userRepository } from '../repositories';
import { UpdateUserUseCase } from './interfaces/UpdateUserUseCase';

export default class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  invoke = (id: string, user: User) => userRepository.update(id, user);
}
