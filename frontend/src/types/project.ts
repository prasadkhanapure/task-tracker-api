export interface Project {
  project_id: number;
  name: string;
  description: string;
}

export interface ProjectStats {
  project_id: number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}
