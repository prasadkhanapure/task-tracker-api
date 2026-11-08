// import React from 'react';
import { useGetTasksQuery } from "../api/taskApi";

const TaskList = () => {
  const { data, isLoading, isError } = useGetTasksQuery();

  if (isLoading) return <p>Loading Tasks</p>;
  if (isError) return <p>Failed to load tasks</p>;

  return (
    <div>
      {data?.items.map((task) => (
        <p key={task.task_id}>{task.title}</p>
      ))}
    </div>
  );
};

export default TaskList;
