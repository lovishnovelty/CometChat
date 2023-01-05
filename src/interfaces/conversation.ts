import {IMessage} from './message';

export interface IConversation {
  message: IMessage;
  senderID: string;
  senderName: string;
  senderAvatar: string;

  // move date to message
  date: string;
}
