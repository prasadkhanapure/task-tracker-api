import { baseApi } from "./baseApi";
import type { Task, TaskListResponse } from "../types/task";

interface PaginationParams {
  offset: number;
  limit: number;
}

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<TaskListResponse, PaginationParams>({
      query: ({ offset, limit }) => ({
        url: "tasks/",
        params: { offset, limit },
      }),
      providesTags: ["Tasks"],
    }),

    createTask: builder.mutation<Task, { title: string; project_id: number }>({
      query: (body) => ({
        url: "tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<
      Task,
      {
        task_id: number;
        title: string;
        completed: boolean;
        project_id: number;
      }
    >({
      query: ({ task_id, ...body }) => ({
        url: `tasks/${task_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),

    deleteTask: builder.mutation<{ message: string }, number>({
      query: (task_id) => ({
        url: `tasks/${task_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
