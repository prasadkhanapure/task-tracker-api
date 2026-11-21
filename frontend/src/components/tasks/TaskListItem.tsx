import { useState } from "react";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../api/taskApi";
import { Check, X } from "lucide-react";
import type { TaskChanges, TaskProps } from "../../types/task";
import TaskActionsMenu from "./TaskActionsMenu";
import { priorityStyles, formatDueDate } from "./utils/tasks";

const TaskListItem = ({ task }: TaskProps) => {
  const { task_id, title, completed, project_id, priority, due_at } = task;

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const [updateTask, { isLoading: isUpdateLoader }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleteLoader }] = useDeleteTaskMutation();

  const handleComplete = async () => {
    try {
      await updateTask({
        task_id,
        title,
        completed: !completed,
        project_id,
        priority,
        due_at,
      }).unwrap();
    } catch (error) {
      console.error("Unable to update the task.", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      await deleteTask(task_id).unwrap();
    } catch (error) {
      console.error("Unable to delete the task.", error);
    }
  };

  const handleDoubleClickEdit = () => {
    setIsEditing(true);
    setEditedTitle(title);
  };

  const handleSaveEdit = async (changedField: TaskChanges) => {
    try {
      await updateTask({
        task_id,
        title,
        completed,
        project_id,
        priority,
        due_at,
        ...changedField,
      }).unwrap();

      if ("title" in changedField) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Unable to update the task.", error);
      throw error;
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedTitle(title);
  };

  const dueDate = due_at ? new Date(due_at) : null;
  const formattedDueDate = formatDueDate(due_at);
  const isOverdue =
    !completed && dueDate !== null && dueDate.getTime() < Date.now();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 transition hover:bg-slate-100">
      <input
        type="checkbox"
        checked={completed}
        onChange={handleComplete}
        disabled={isUpdateLoader}
        className="h-5 w-5 shrink-0 cursor-pointer accent-violet-600"
      />

      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
            autoFocus
            className="min-w-0 flex-1 rounded-md border border-violet-400 px-2 py-1 outline-none"
          />
          <button
            type="button"
            title="Save changes"
            aria-label="Save changes"
            disabled={isUpdateLoader || !editedTitle.trim()}
            onClick={() => handleSaveEdit({ title: editedTitle.trim() })}
            className="cursor-pointer rounded-md p-2 text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Check size={18} />
          </button>
          <button
            type="button"
            title="Cancel editing"
            aria-label="Cancel editing"
            onClick={handleCancelEdit}
            className="cursor-pointer rounded-md p-2 text-slate-500 transition-colors hover:bg-slate-200 disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </>
      ) : (
        <>
          <p
            onDoubleClick={handleDoubleClickEdit}
            className={`flex-1 text-sm ${
              completed ? "text-slate-400 line-through" : "text-slate-800"
            }`}
          >
            {title}
          </p>
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium capitalize ${priorityStyles[priority]}`}
          >
            {priority}
          </span>
          {formattedDueDate && (
            <span
              className={`text-xs ${
                isOverdue ? "font-medium text-red-600" : "text-slate-500"
              }`}
            >
              {isOverdue ? "Overdue: " : "Due: "}
              {formattedDueDate}
            </span>
          )}
        </>
      )}
      <TaskActionsMenu
        priority={priority}
        dueAt={due_at}
        onApplyEdit={handleSaveEdit}
        onDelete={handleDelete}
        disabled={isUpdateLoader || isDeleteLoader}
      />
    </div>
  );
};

export default TaskListItem;
