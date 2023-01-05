import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IAuthSlice} from '../../interfaces/redux';

const initialState: IAuthSlice = {
  isSignedIn: false,
  name: '',
  userID: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<{name: string; id: string}>) => {
      state.isSignedIn = true;
      state.userID = action.payload.id;
      state.name = action.payload.name;
    },
    restoreAuthState: (state, {payload}: PayloadAction<IAuthSlice>) => {
      state.isSignedIn = payload.isSignedIn;
      state.userID = payload.userID;
      state.name = payload.name;
    },
  },
});

export const {signIn, restoreAuthState} = authSlice.actions;
export const authReducer = authSlice.reducer;
