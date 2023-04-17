import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { login, update, validateRefresh } from "../../APIServices";
import { dark, light } from "../../../fakeDb/theme";

const theme = JSON.parse(localStorage.getItem("theme")),
  token = localStorage.getItem("token"),
  maxPage = Number(localStorage.getItem("maxPage"));

const initialState = {
  auth: {},
  token,
  isAdmin: false,
  maxPage: maxPage || 6,
  theme: theme || light,
  progress: 0,
  isSuccess: false,
  isLoading: false,
};

export const LOGIN = createAsyncThunk("auth/login", (user, thunkAPI) => {
  try {
    return login(user.email, user.password);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const REFRESH = createAsyncThunk(
  "auth/validateRefresh",
  (token, thunkAPI) => {
    try {
      return validateRefresh(token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UPDATE = createAsyncThunk(
  "auth/update",
  async (data, thunkAPI) => {
    try {
      return await update("members", data.form, data.form._id, data.token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    THEME: (state, data) => {
      let theme;
      if (data.payload) {
        theme = dark;
      } else {
        theme = light;
      }
      state.theme = theme;
      localStorage.setItem("theme", JSON.stringify(theme));
    },
    MAXPAGE: (state, data) => {
      if (typeof data.payload === "number") {
        state.maxPage = data.payload;
        localStorage.setItem("maxPage", data.payload);
      } else {
        if (data.payload) {
          if (state.maxPage < 50) {
            state.maxPage += 1;
            localStorage.setItem("maxPage", state.maxPage);
          } else {
            toast.warn("Maximum we can go is 50 items per page.");
          }
        } else {
          if (state.maxPage > 1) {
            state.maxPage -= 1;
            localStorage.setItem("maxPage", state.maxPage);
          } else {
            toast.warn("Minimum we can go is 1 item per page.");
          }
        }
      }
    },
    ADMIN: state => {
      state.isAdmin = !state.isAdmin;
    },
    RESET: state => {
      state.isSuccess = false;
    },
  },
  extraReducers: builder => {
    builder
      // LOGIN
      .addCase(LOGIN.pending, state => {
        state.isLoading = true;
      })
      .addCase(LOGIN.fulfilled, (state, action) => {
        state.auth = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", state.token);
        state.isLoading = false;
      })
      .addCase(LOGIN.rejected, (state, action) => {
        state.isLoading = false;
      })

      // VALIDATE USER ON REFRESH
      .addCase(REFRESH.pending, state => {
        state.isLoading = true;
      })
      .addCase(REFRESH.fulfilled, (state, action) => {
        state.auth = action.payload;
        state.isLoading = false;
      })
      .addCase(REFRESH.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(UPDATE.pending, state => {
        state.isLoading = true;
      })
      .addCase(UPDATE.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.auth = action.payload;
      })
      .addCase(UPDATE.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { THEME, MAXPAGE, RESET, ADMIN } = authSlice.actions;

export default authSlice.reducer;
