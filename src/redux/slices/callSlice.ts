import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICallSlice} from '../../interfaces/redux';

const initialState: ICallSlice = {
  incomingCallID: '',
  incomingCallInitiator: {
    name: '',
    avatar: '',
  },
};

const callSlice = createSlice({
  name: 'call_slice',
  initialState,
  reducers: {
    setIncomingCall: (state, {payload}: PayloadAction<ICallSlice>) => {
      state.incomingCallID = payload.incomingCallID;
      state.incomingCallInitiator.name = payload.incomingCallInitiator.name;
      state.incomingCallInitiator.avatar = payload.incomingCallInitiator.avatar;
    },
    endIncomingCall: state => {
      state.incomingCallID = '';
      state.incomingCallInitiator = {
        name: '',
        avatar: '',
      };
    },
  },
});

export const callReducer = callSlice.reducer;
export const {setIncomingCall} = callSlice.actions;
