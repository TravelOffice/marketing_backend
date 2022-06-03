import { Task } from '../models/Task';
import { TaskRepository } from './interfaces/TaskRepository';

export default class TaskRepositoryImpl implements TaskRepository {
  /**
   * Generate task data before save to dynamodb
   * @param tasks List of task
   * @param creatorId Id of creator
   * @param creatorName Name of creator
   * @returns List of task after generating data
   */
  generateData = (tasks: Task[], creatorId: string, creatorName: string): Task[] => {
    const newTasks: Task[] = tasks.map((task) => (
      {
        ...task,
        creatorId: task.creatorId ? task.creatorId : creatorId,
        creatorName: task.creatorName ? task.creatorName : creatorName,
        createdAt: task.createdAt ? task.createdAt : Date.now(),
        isCompleted: task.isCompleted || false,
      }
    ));
    return newTasks;
  };
}
