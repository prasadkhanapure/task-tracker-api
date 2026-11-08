import type { Task } from "../types/task";

interface TaskProps {
  task: Task;
}

const TaskListItem = ({ task }: TaskProps) => {
  const { title, completed } = task;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
      <input
        type="checkbox"
        checked={completed}
        readOnly
        className="h-5 w-5 shrink-0 cursor-pointer accent-violet-600"
      />
      <p
        className={`flex-1 text-sm ${
          completed ? "text-slate-400 line-through" : "text-slate-800"
        }`}
      >
        {title}
      </p>
      <button className="rounded-md px-3 py-1.5 text-sm font-medium text-violet-600 transition hover:bg-violet-100 cursor-pointer">
        Edit
      </button>
    </div>
  );
};

export default TaskListItem;
