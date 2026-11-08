import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Task, TaskListResponse } from "../types/task";

const API_BASE_URL = "http://127.0.0.1:8000/";

export const taskApi = createApi({
  reducerPath: "taskApi",
  tagTypes: ["Tasks"],

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),

  endpoints: (builder) => ({
    getTasks: builder.query<TaskListResponse, void>({
      query: () => "tasks/",
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
  }),
});

export const {
  useGetTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
