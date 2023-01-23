export interface ICallSlice {
  incomingCallID: string;
  incomingCallInitiator: {
    name: string;
    avatar: string;
  };
  currentChatUserID: string;
}
