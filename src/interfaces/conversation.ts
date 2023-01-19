import {IMessage} from './message';

export interface IConversation {
  id: string;
  lastMessage: IMessage;
  otherUserID: string;
  otherUserName: string;
  otherUserAvatar: string;
}
