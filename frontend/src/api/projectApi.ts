import type { Project } from "../types/project";
import { baseApi } from "./baseApi";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => ({
        url: "projects/",
      }),
      providesTags: ["Projects"],
    }),
  }),
});

export const { useGetProjectsQuery } = projectApi;
