export interface Task {
  task_id: number;
  title: string;
  completed: boolean;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
}
