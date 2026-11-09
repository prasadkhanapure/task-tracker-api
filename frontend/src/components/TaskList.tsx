import { useEffect, useState } from "react";
import { useGetTasksQuery } from "../api/taskApi";
import InputTask from "./InputTask";
import TaskSection from "./TaskSection";
import Pagination from "./Pagination";

const TaskList = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const offset = (page - 1) * limit;

  const { data, isLoading, isError } = useGetTasksQuery({ offset, limit });
  const totalPages = Math.ceil((data?.total ?? 0) / limit);

  useEffect(() => {
    if (!data) return;

    const lastPage = Math.max(1, Math.ceil(data.total / limit));
    if (page > lastPage) setPage(lastPage);
  }, [data, page, limit]);

  if (isLoading) return <p>Loading Tasks</p>;
  if (isError) return <p>Failed to load tasks</p>;

  const pendingTasks = data?.items.filter((task) => !task.completed) ?? [];
  const completedTasks = data?.items.filter((task) => task.completed) ?? [];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">My Tasks</h1>

        <InputTask />

        <TaskSection
          title="Pending Tasks"
          tasks={pendingTasks}
          emptyMessage="No pending tasks."
        />

        <TaskSection
          title="Completed Tasks"
          tasks={completedTasks}
          emptyMessage="No completed tasks yet."
        />

        <Pagination
          totalPages={totalPages}
          page={page}
          onPageChange={setPage}
        />
      </div>
    </main>
  );
};

export default TaskList;
