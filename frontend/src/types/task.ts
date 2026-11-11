export interface Task {
  task_id: number;
  title: string;
  completed: boolean;
  project_id: number;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
}
