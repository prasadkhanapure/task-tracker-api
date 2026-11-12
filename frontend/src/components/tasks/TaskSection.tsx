import type { Task } from "../../types/task";
import TaskListItem from "./TaskListItem";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  emptyMessage: string;
}

const TaskSection = ({ title, tasks, emptyMessage }: TaskSectionProps) => {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold text-slate-600">
        {title} ({tasks.length})
      </h2>

      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskListItem key={task.task_id} task={task} />
        ))}

        {tasks.length === 0 && (
          <p className="py-4 text-sm text-slate-400">{emptyMessage}</p>
        )}
      </div>
    </section>
  );
};

export default TaskSection;
