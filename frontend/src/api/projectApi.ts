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

    createProject: builder.mutation<
      Project,
      { name: string; description: string }
    >({
      query: (body) => ({
        url: "projects/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),

    updateProject: builder.mutation<
      Project,
      { project_id: number; name: string; description: string }
    >({
      query: ({ project_id, ...body }) => ({
        url: `projects/${project_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
} = projectApi;
