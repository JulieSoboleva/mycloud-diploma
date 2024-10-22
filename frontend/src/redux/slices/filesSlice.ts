import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IChangeFileData, IDownloadFileData, IFile } from '../../models';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

interface InitialState {
  filesList: IFile[],
  isLoading: boolean,
  error: string,
}

const initialState: InitialState = {
  filesList: [],
  isLoading: true,
  error: '',
};

const FilesSlice = createSlice({
  name: 'files',
  initialState,
  selectors: {
    filesState: (state) => state,
  },
  reducers: {
    clearFilesList: (state) => {
      state.filesList = [];
    },
    clearError: (state) => {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilesList.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(getFilesList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filesList = action.payload;
      })
      .addCase(getFilesList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadFile.pending, (state) => {
        state.error = '';
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changeFile.pending, (state) => {
        state.error = '';
      })
      .addCase(changeFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(downloadFile.pending, (state) => {
        state.error = '';
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getFileLink.pending, (state) => {
        state.error = '';
      })
      .addCase(getFileLink.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFile.pending, (state) => {
        state.error = '';
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const getFilesList = createAsyncThunk(
  'file/list',
  async (username: string | undefined, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/file/list/${username}/`, {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue('Ошибка получения списка файлов');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const uploadFile = createAsyncThunk(
  'file/upload',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/file/`, {
        method: 'POST',
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!response.ok) {
        return rejectWithValue('Ошибка загрузки файла');
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const changeFile = createAsyncThunk(
  'file/update',
  async (fileData: IChangeFileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/file/${fileData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(fileData),
      });

      if (!response.ok) {
        return rejectWithValue(
          'Ошибка изменения данных о файле'
        );
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const downloadFile = createAsyncThunk(
  'file/download',
  async (fileData: IDownloadFileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${BASE_URL}/file/download/${fileData.id}/`,
        {
          method: 'GET',
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) {
        return rejectWithValue('Ошибка скачивания файла');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      console.log('file_name = ', fileData.file_name);
      link.download = fileData.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const getFileLink = createAsyncThunk(
  'file/getLink',
  async (fileId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/file/link/${fileId}/`, {
        method: 'GET',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          'Ошибка получения специальной ссылки на файл'
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);

export const deleteFile = createAsyncThunk(
  'file/delete',
  async (fileId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${BASE_URL}/file/${fileId}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue('Ошибка удаления файла');
      }
    } catch (error) {
      return rejectWithValue('Ошибка на стороне сервера: ' + error);
    }
  }
);



export const { filesState } = FilesSlice.selectors;
export const { clearFilesList, clearError } = FilesSlice.actions;
export default FilesSlice.reducer;