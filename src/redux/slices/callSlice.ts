import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ICallSlice} from '../../interfaces/redux';

const initialState: ICallSlice = {
  incomingCallID: '',
  incomingCallInitiator: {
    name: '',
    avatar: '',
  },
  currentChatUserID: '',
  activeSessionDetail: {
    sessionID: '',
  },
};

const callSlice = createSlice({
  name: 'call_slice',
  initialState,
  reducers: {
    setIncomingCall: (
      state,
      {
        payload,
      }: PayloadAction<
        Omit<ICallSlice, 'currentChatUserID' | 'activeSessionDetail'>
      >,
    ) => {
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
    setCurrentChatUserID: (state, {payload}: PayloadAction<string>) => {
      state.currentChatUserID = payload;
    },
    joinSession: (state, {payload}: PayloadAction<string>) => {
      state.activeSessionDetail.sessionID = payload;
    },
  },
});

export const callReducer = callSlice.reducer;
export const {setIncomingCall, setCurrentChatUserID, joinSession} =
  callSlice.actions;
