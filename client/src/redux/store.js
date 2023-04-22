import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/persons/auth";
import clusters from "./slices/organizations/clusters";
import posts from "./slices/organizations/posts";
import pages from "./slices/organizations/pages";
import meetings from "./slices/organizations/meetings";
import groupchats from "./slices/organizations/groupchats";
import members from "./slices/persons/members";

export const store = configureStore({
  reducer: {
    auth,
    clusters,
    members,
    posts,
    meetings,
    pages,
    groupchats,
  },
});
