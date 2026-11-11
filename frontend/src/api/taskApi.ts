import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task, TaskListResponse } from "../types/task";

interface PaginationParams {
  offset: number;
  limit: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const taskApi = createApi({
  reducerPath: "taskApi",
  tagTypes: ["Tasks"],

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),

  endpoints: (builder) => ({
    getTasks: builder.query<TaskListResponse, PaginationParams>({
      query: ({ offset, limit }) => ({
        url: "tasks/",
        params: { offset, limit },
      }),
      providesTags: ["Tasks"],
    }),

    updateTask: builder.mutation<
      Task,
      {
        task_id: number;
        title: string;
        completed: boolean;
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

    createTask: builder.mutation<
      Task,
      { title: string; project_id: number | null }
    >({
      query: (body) => ({
        url: "tasks/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tasks"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateTaskMutation,
} = taskApi;
