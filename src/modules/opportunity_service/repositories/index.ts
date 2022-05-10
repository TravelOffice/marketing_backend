import OpportunityRepositoryImpl from './OpportunityRepositoryImpl';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { LeadRepository } from './interfaces/LeadRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';

interface Repositories {
  opportunityRepository: OpportunityRepository,
  userRepository: UserRepository,
  leadRepository: LeadRepository,
}

const repositories : Repositories = {
  opportunityRepository: new OpportunityRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
};

export const {
  opportunityRepository,
  userRepository,
  leadRepository,
} = repositories;
