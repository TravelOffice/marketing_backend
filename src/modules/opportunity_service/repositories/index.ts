import OpportunityRepositoryImpl from './OpportunityRepositoryImpl';
import { OpportunityRepository } from './interfaces/OpportunityRepository';
import { UserRepository } from './interfaces/UserRepository';
import UserRepositoryImpl from './UserRepositoryImpl';
import { LeadRepository } from './interfaces/LeadRepository';
import LeadRepositoryImpl from './LeadRepositoryImpl';
import { TaskRepository } from './interfaces/TaskRepository';
import TaskRepositoryImpl from './TaskRepositoryImpl';
import { NoteRepository } from './interfaces/NoteRepository';
import NoteRepositoryImpl from './NoteRepositoryImpl';

interface Repositories {
  opportunityRepository: OpportunityRepository,
  userRepository: UserRepository,
  leadRepository: LeadRepository,
  taskRepository: TaskRepository,
  noteRepository: NoteRepository,
}

const repositories : Repositories = {
  opportunityRepository: new OpportunityRepositoryImpl(),
  userRepository: new UserRepositoryImpl(),
  leadRepository: new LeadRepositoryImpl(),
  taskRepository: new TaskRepositoryImpl(),
  noteRepository: new NoteRepositoryImpl(),
};

export const {
  opportunityRepository,
  userRepository,
  leadRepository,
  taskRepository,
  noteRepository,
} = repositories;
