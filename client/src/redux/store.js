import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/persons/auth";

export const store = configureStore({
  reducer: {
    auth,
  },
});
