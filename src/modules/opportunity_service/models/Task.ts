export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  title: string,
  description: string,
  priority: TaskPriority,
  createdAt?: number,
  creatorId: string,
  creatorName: string,
  dueDate: string,
  isCompleted: boolean
}
