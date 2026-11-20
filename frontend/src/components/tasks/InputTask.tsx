import { useState } from "react";
import { useCreateTaskMutation } from "../../api/taskApi";
import { useGetProjectsQuery } from "../../api/projectApi";
import type { Task } from "../../types/task";

const InputTask = () => {
  const [title, setTitle] = useState<string>("");
  const [projectId, setProjectId] = useState<number | null>(null);
  const [priority, setPriority] = useState<Task["priority"]>("none");
  const [dueAt, setDueAt] = useState("");

  const [createTask, { isLoading: isCreateLoading }] = useCreateTaskMutation();
  const { data, isLoading, isError } = useGetProjectsQuery();

  const defaultProjectId =
    data?.find((project) => project.name === "Default Project")?.project_id ??
    data?.[0]?.project_id ??
    null;

  const selectedProjectId = projectId ?? defaultProjectId;

  const handleTaskCreation = async (
    event: React.SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle || selectedProjectId === null) return;

    try {
      await createTask({
        title: trimmedTitle,
        project_id: selectedProjectId,
        priority,
        due_at: dueAt ? new Date(dueAt).toISOString() : null,
      }).unwrap();

      setTitle("");
      setPriority("none");
      setDueAt("");
    } catch (error) {
      console.error("Unable to create the task.", error);
    }
  };

  if (isLoading) return <p>Loading Tasks</p>;
  if (isError) return <p>Failed to load tasks</p>;

  return (
    <form onSubmit={handleTaskCreation} className="w-full max-w-xl space-y-3">
      <input
        type="text"
        placeholder="Enter a new task..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Priority
          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value as Task["priority"])
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          >
            <option value="none">None</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Dealine
          <input
            type="datetime-local"
            value={dueAt}
            onChange={(event) => setDueAt(event.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <select
          value={selectedProjectId ?? ""}
          onChange={(event) => setProjectId(Number(event.target.value))}
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        >
          {data?.map((project) => (
            <option key={project.project_id} value={project.project_id}>
              {project.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={
            isCreateLoading || !title.trim() || selectedProjectId === null
          }
          className="shrink-0 rounded-lg bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          +
        </button>
      </div>
    </form>
  );
};

export default InputTask;
