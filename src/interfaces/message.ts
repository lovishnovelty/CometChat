import {CallType} from '../enums';

export interface IMessage {
  text: string;
  initiatorName: string;
  isSentByMe: boolean;
  isTextMessage: boolean;
  isCallMessage: boolean;
  isMediaMessage: boolean;
  callType?: CallType;
  time: string;
  date: string;
}
