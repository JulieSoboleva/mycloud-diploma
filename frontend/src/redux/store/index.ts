import { combineReducers, configureStore } from '@reduxjs/toolkit'
import UsersSlice from '../slices/usersSlice'
import FilesSlice from '../slices/filesSlice'

const rootReducer = combineReducers({
    users: UsersSlice,
    files: FilesSlice,
});


export const store = configureStore({
    reducer: rootReducer, //persistReducer(persistConfig, rootReducer),
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({ 
    //         thunk: false,
    //         serializableCheck: {
    //             ignoredActions: [
    //                 'persist/PERSIST',
    //                 'persist/REHYDRATE',
    //                 'persist/PURGE',
    //                 'persist/REGISTER',
    //                 'persist/FLUSH',
    //                 'persist/PAUSE'
    //             ],
    //         },
    //     }),
});

// export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;