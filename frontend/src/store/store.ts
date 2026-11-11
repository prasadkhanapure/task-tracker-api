import { configureStore } from "@reduxjs/toolkit";
import { taskApi } from "../api/taskApi";
import { projectApi } from "../api/projectApi";

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer
  },
  middleware: (getDefeaultMiddleware) =>
    getDefeaultMiddleware().concat(taskApi.middleware, projectApi.middleware),
});
