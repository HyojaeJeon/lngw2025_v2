import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from "./slices/authSlice";
import languageReducer from "./slices/languageSlice";

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'language'] // auth와 language 리듀서 모두 persist
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  language: languageReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
