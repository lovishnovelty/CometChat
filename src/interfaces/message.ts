import {CallActionType, CallType} from '../enums';

// need to create separate config object for call and media
export interface IMessage {
  id: string;
  conversationID: string;
  text: string;
  initiatorName: string;
  receiverName: string;
  isSentByMe: boolean;
  isTextMessage: boolean;
  isCallMessage: boolean;
  isMediaMessage: boolean;
  callType?: CallType;
  callActionType?: CallActionType;
  time: string;
  date: string;
}
