import {createSlice} from '@reduxjs/toolkit';
import {ICallSlice} from '../../interfaces/redux';

const initialState: ICallSlice = {
  sessionID: '',
};

const callSlice = createSlice({
  name: 'call_slice',
  initialState,
  reducers: {},
});

export const callReducer = callSlice.reducer;
export const {} = callSlice.actions;
