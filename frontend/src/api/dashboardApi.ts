import type { DashboardStats } from "../types/dashboard";
import { baseApi } from "./baseApi";

export const DashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => ({
        url: "dashboard/stats/",
      }),
      providesTags: ["Projects", "Tasks"],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = DashboardApi;
