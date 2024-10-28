import { createSlice } from '@reduxjs/toolkit'
import { IFile } from '../../models'
import { 
  changeFile,
  deleteFile,
  downloadFile,
  getFileLink,
  getFilesList,
  uploadFile 
} from '../../services/fileServices'

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
        state.filesList.forEach((file) => {
          file.key = file.id.toString();
        });
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

export const { filesState } = FilesSlice.selectors;
export const { clearFilesList, clearError } = FilesSlice.actions;
export default FilesSlice.reducer;