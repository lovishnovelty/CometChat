import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IAuthSlice} from '../../interfaces/redux';

const initialState: IAuthSlice = {
  isSignedIn: false,
  userID: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<string>) => {
      state.isSignedIn = true;
      state.userID = action.payload;
    },
  },
});

export const {signIn} = authSlice.actions;
export const authReducer = authSlice.reducer;
