import { configureStore } from "@reduxjs/toolkit";
import { taskApi } from "../api/taskApi";

export const store = configureStore({
  reducer: {
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefeaultMiddleware) =>
    getDefeaultMiddleware().concat(taskApi.middleware),
});
