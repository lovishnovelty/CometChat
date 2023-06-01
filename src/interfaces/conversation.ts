import {ConvoType} from '../enums';
import {IMessage} from './message';

export interface IConversation {
  id: string;
  convoType: ConvoType;
  lastMessage: IMessage;
  convoWith: {
    id: string;
    name: string;
    avatar: string;
  };
}
