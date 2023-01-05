import {IMessage} from './message';

export interface IConversation {
  convoID: string;
  message: IMessage;
  otherUserID: string;
  otherUserName: string;
  otherUserAvatar: string;
}
