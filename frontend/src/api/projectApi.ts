import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "../types/project";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const projectApi = createApi({
  reducerPath: "projectApi",
  tagTypes: ["Projects"],

  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),

  endpoints: (builder) => ({
    getProjects: builder.query<[Project], void>({
      query: () => ({
        url: "projects/",
      }),
      providesTags: ["Projects"],
    }),
  }),
});

export const { useGetProjectsQuery } = projectApi;
