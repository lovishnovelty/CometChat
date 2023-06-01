import {CallActionType, CallType} from '../enums';
import {IGroup, IUser} from './user';
export interface IMessage {
  id: string;
  conversationID: string;
  text: string;
  isSentByMe: boolean;
  isTextMessage: boolean;
  isCallMessage: boolean;
  isMediaMessage: boolean;
  sender: IUser;
  receiver: IUser | IGroup;
  time: string;
  date: string;
  callDetails?: ICallDetail;
  mediaDetails?: IMediaDetail;
}

export interface ICallDetail {
  sessionID: string;
  callType: CallType;
  callActionType: CallActionType;
  isInitiatedByMe: boolean;
  initiator: IUser;
  receiver: IUser | IGroup;
}

export interface IMediaDetail {}
