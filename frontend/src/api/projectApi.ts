import type { Project, ProjectStats } from "../types/project";
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
    deleteProject: builder.mutation<{ message: string }, number>({
      query: (project_id) => ({
        url: `projects/${project_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Projects"],
    }),

    getProjectStats: builder.query<ProjectStats, void>({
      query: () => ({
        url: "projects/stats/",
      }),
      providesTags: ["Projects", "Tasks"],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectStatsQuery,
} = projectApi;
