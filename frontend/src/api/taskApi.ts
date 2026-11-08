import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TaskListResponse } from "../types/task";

const API_BASE_URL = "http://127.0.0.1:8000";

export const taskApi = createApi({
  reducerPath: "taskApi",

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),

  endpoints: (builder) => ({
    getTasks: builder.query<TaskListResponse, void>({
      query: () => "tasks/",
    }),
  }),
});

export const { useGetTasksQuery } = taskApi;
