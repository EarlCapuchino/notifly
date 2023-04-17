import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/persons/auth";
import clusters from "./slices/organizations/clusters";
import members from "./slices/persons/members";

export const store = configureStore({
  reducer: {
    auth,
    clusters,
    members,
  },
});
