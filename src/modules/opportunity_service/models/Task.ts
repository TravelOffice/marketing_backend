export interface Task {
  name: string,
  description: string,
  createdAt?: number,
  creatorId: string,
  creatorName: string,
  dueDate: string,
}
