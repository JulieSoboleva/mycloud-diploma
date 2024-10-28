import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UsersSlice from '../slices/usersSlice'
import FilesSlice from '../slices/filesSlice'

const rootReducer = combineReducers({
    users: UsersSlice,
    files: FilesSlice,
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;