import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/persons/auth";
import clusters from "./slices/organizations/clusters";

export const store = configureStore({
  reducer: {
    auth,
    clusters,
  },
});
