import { useDeleteTaskMutation, useUpdateTaskMutation } from "../api/taskApi";
import type { Task } from "../types/task";
import { Trash2 } from "lucide-react";

interface TaskProps {
  task: Task;
}

const TaskListItem = ({ task }: TaskProps) => {
  const { task_id, title, completed } = task;

  const [updateTask, { isLoading: isUpdateLoader }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleteLoader }] = useDeleteTaskMutation();

  const handleComplete = async () => {
    try {
      await updateTask({
        task_id,
        title,
        completed: !completed,
      });
    } catch (error) {
      console.error("Unable to update the task.", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(task_id);
    } catch (error) {
      console.error("Unable to delete the task.", error);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
      <input
        type="checkbox"
        checked={completed}
        className="h-5 w-5 shrink-0 cursor-pointer accent-violet-600"
        onChange={handleComplete}
        disabled={isUpdateLoader}
      />
      <p
        className={`flex-1 text-sm ${
          completed ? "text-slate-400 line-through" : "text-slate-800"
        }`}
      >
        {title}
      </p>
      <button
        onClick={handleDelete}
        disabled={isDeleteLoader}
        className="cursor-pointer rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
      >
        <Trash2 size={18} className="text-red-500" />
      </button>
    </div>
  );
};

export default TaskListItem;
