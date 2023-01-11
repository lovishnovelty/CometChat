import {CometChat} from '@cometchat-pro/react-native-chat';
import {CallActionType, CallType} from '../enums';
import {IConversation} from '../interfaces';
import {IMessage} from '../interfaces/message';
import moment from 'moment';
import {capitalizeInitials} from './common';

export class ChatUtility {
  static transformChatList = (
    chatList: CometChat.Conversation[],
    userID: string,
  ): IConversation[] => {
    return chatList.map(convo => {
      const otherUser = convo.getConversationWith() as CometChat.User;
      return {
        id: convo.getConversationId(),
        lastMessage: this.transformSingleMessage(
          convo.getLastMessage(),
          userID,
        ),
        otherUserName: otherUser.getName(),
        otherUserAvatar: otherUser.getAvatar(),
        otherUserID: otherUser.getUid(),
      };
    });
  };

  static transformMessages = (
    messageList: CometChat.BaseMessage[],
    userID: string,
  ): IMessage[] => {
    return messageList.map(item => {
      return this.transformSingleMessage(item, userID);
    });
  };

  static transformSingleMessage = (
    message: CometChat.BaseMessage,
    userID: string,
  ): IMessage => {
    const id = message.getId().toString();
    const conversationID = message.getConversationId();
    const isTextMessage = message instanceof CometChat.TextMessage;
    const isMediaMessage = message instanceof CometChat.MediaMessage;
    const isCallMessage = message instanceof CometChat.Call;
    const isSentByMe = userID === message.getSender().getUid();
    let initiatorName = message.getSender().getName();

    const messageInitiator = isSentByMe ? 'You' : initiatorName;

    // call message configurations
    let callType: CallType | undefined;
    let callActionType: CallActionType | undefined;
    let callMessage = '';
    if (isCallMessage) {
      callType = message.getType() as CallType;
      callActionType = message.getAction() as CallActionType;
      const article = callType === CallType.AUDIO ? 'an' : 'a';
      switch (callActionType) {
        case CallActionType.INITIATED:
          callMessage = `${messageInitiator} started ${article} ${callType} call`;
          break;
        case CallActionType.ONGOING:
          callMessage = `Ongoing Call.`;
          break;
        case CallActionType.ENDED:
          callMessage = `${capitalizeInitials(callType)} call ended.`;
          break;
      }
    }

    // media message configurations
    const mediaMessage = `${messageInitiator} sent a file.`;

    // selecting message based on message type
    const text = isTextMessage
      ? message.getText()
      : isCallMessage
      ? callMessage
      : isMediaMessage
      ? mediaMessage
      : '';

    const sentAt = moment(new Date(message.getSentAt()));
    const time = sentAt.format('h a');
    const date = sentAt.format('D MMM');

    return {
      id,
      conversationID,
      text,
      initiatorName,
      isSentByMe,
      isTextMessage,
      isCallMessage,
      isMediaMessage,
      callType,
      callActionType,
      time,
      date,
    };
  };
}
