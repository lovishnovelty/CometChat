import {configureStore} from '@reduxjs/toolkit';
import {authReducer, callReducer} from './slices';

export const store = configureStore({
  reducer: {
    call: callReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
