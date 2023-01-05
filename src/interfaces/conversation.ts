import {IMessage} from './message';

export interface IConversation {
  message: IMessage;
  otherUserID: string;
  otherUserName: string;
  otherUserAvatar: string;
}
