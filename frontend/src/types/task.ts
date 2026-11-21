type TaskPriority = "none" | "low" | "medium" | "high";

export type CreateTaskPayload = Pick<Task, "title" | "project_id"> &
  Partial<Pick<Task, "priority" | "due_at">>;

export type TaskChanges = Partial<Pick<Task, "title" | "priority" | "due_at">>;

export type UpdateTaskPayload = Pick<
  Task,
  "task_id" | "title" | "completed" | "project_id" | "priority" | "due_at"
>;

export interface TaskProps {
  task: Task;
}
export interface TaskActionsMenuProps {
  priority: TaskPriority;
  dueAt: string | null;
  onApplyEdit: (value: TaskChanges) => Promise<void>;
  onDelete: () => void;
  disabled?: boolean;
}
export interface PaginationParams {
  offset: number;
  limit: number;
}
export interface Task {
  task_id: number;
  title: string;
  completed: boolean;
  project_id: number;
  priority: TaskPriority;
  due_at: string | null;
}

export interface TaskListResponse {
  items: Task[];
  total: number;
  limit: number;
  offset: number;
}
