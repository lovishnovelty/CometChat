import {IMessage} from './message';

export interface IConversation {
  id: string;
  message: IMessage;
  otherUserID: string;
  otherUserName: string;
  otherUserAvatar: string;
}
