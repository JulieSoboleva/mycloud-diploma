import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  IUser,
  IUserForAdmin,
  IRegisterFormData,
  ILoginFormData,
  IUpdateUserData,
} from '../../models';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

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

export const registerUser = createAsyncThunk(
  'user/register',
  async (formData: IRegisterFormData, { rejectWithValue }) => {
    try {
      const data = {
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(`${BASE_URL}/user/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();

        if (error.username) {
          return rejectWithValue(error.username[0]);
        } else if (error.email) {
          return rejectWithValue(error.email[0]);
        }
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (formData: ILoginFormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/user/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        return rejectWithValue('Неверно введён логин или пароль');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/user/logout/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          'Ошибка выхода пользователя из системы'
        );
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const getUsersList = createAsyncThunk(
  'user/list',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/user/`, {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          'Ошибка получения списка пользователей'
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: IUpdateUserData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/user/${userData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return rejectWithValue(
          'Ошибка редактирования данных пользователя'
        );
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/user/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue('Ошибка удаления пользователя');
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

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