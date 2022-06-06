import { LeadRepository } from './interfaces/LeadRepository';
import { UserRepository } from './interfaces/UserRepository';
import { CognitoUserRepository } from './interfaces/CognitoUserRepository';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import UserRepositoryImpl from './UserRepositoryImpl';
import CognitoUserRepositoryImpl from './CognitoUserRepositoryImpl';
import OpportunityRepositoryImpl from './OpportunityRepositoryImpl';
import { TaskRepository } from './interfaces/TaskRepository';
import TaskRepositoryImpl from './TaskRepositoryImpl';
import { NoteRepository } from './interfaces/NoteRepository';
import NoteRepositoryImpl from './NoteRepositoryImpl';

interface Repositories {
  leadRepository: LeadRepository,
  userRepository: UserRepository,
  cognitoUserRepository: CognitoUserRepository,
  opportunityRepository: OpportunityRepository,
  taskRepository: TaskRepository,
  noteRepository: NoteRepository,
}

const repositories : Repositories = {
  leadRepository: new LeadRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  cognitoUserRepository: new CognitoUserRepositoryImpl(),
  opportunityRepository: new OpportunityRepositoryImpl(),
  taskRepository: new TaskRepositoryImpl(),
  noteRepository: new NoteRepositoryImpl(),
};

export const {
  leadRepository,
  userRepository,
  cognitoUserRepository,
  opportunityRepository,
  taskRepository,
  noteRepository,
} = repositories;
