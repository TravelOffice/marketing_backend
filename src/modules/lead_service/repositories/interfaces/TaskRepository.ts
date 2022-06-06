import { Task } from '../../models/Task';

export interface TaskRepository {
  generateData: (tasks: Task[], creatorId: string, creatorName: string) => Task[]
}
