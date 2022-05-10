import OpportunityRepositoryImpl from './OpportunityRepositoryImpl';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';

interface Repositories {
  opportunityRepository: OpportunityRepository,
  userRepository: UserRepository,
}

const repositories : Repositories = {
  opportunityRepository: new OpportunityRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
};

export const {
  opportunityRepository,
  userRepository,
} = repositories;
