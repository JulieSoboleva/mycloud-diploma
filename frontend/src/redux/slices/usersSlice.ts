import { createSlice } from '@reduxjs/toolkit'
import {
  IUser,
  IUserForAdmin,
} from '../../models'
import { 
  deleteUser,
  getUsersList,
  loginUser,
  logoutUser,
  registerUser
} from '../../services/userServices'

interface InitialState {
  currentUser: IUser | null,
  storageOwner: IUser | null,
  usersList: IUserForAdmin[],
  isLoading: boolean,
  error: string,
}

const initialState: InitialState = {
  currentUser: null,
  storageOwner: null,
  usersList: [],
  isLoading: false,
  error: '',
};

const UsersSlice = createSlice({
  name: 'users',
  initialState,
  selectors: {
    usersState: (state) => state,
  },
  reducers: {
    setStorageOwner: (state, action) => {
      state.storageOwner = action.payload;
    },
    clearStorageOwner: (state) => {
      state.storageOwner = null;
    },
    clearUsersList: (state) => {
      state.usersList = [];
    },
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = '';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.usersList = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = action.payload;
        state.usersList.forEach((user) => user.key = user.id.toString());
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { usersState } = UsersSlice.selectors;
export const {
  setStorageOwner,
  clearStorageOwner,
  clearUsersList,
  clearError,
} = UsersSlice.actions;
export default UsersSlice.reducer;