import {CometChat} from '@cometchat-pro/react-native-chat';
import {CallType} from '../enums';
import {IConversation} from '../interfaces';
import {IMessage} from '../interfaces/message';
import moment from 'moment';

export class ChatUtility {
  static transformChatList = (
    chatList: CometChat.Conversation[],
    userID: string,
  ): IConversation[] => {
    return chatList.map(convo => {
      const otherUser = convo.getConversationWith() as CometChat.User;
      return {
        id: convo.getConversationId(),
        message: this.transformSingleMessage(convo.getLastMessage(), userID),
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
    const callType = CallType.AUDIO;

    const callMessage = `${messageInitiator} started a ${callType} call`;
    const mediaMessage = `${messageInitiator} sent a file.`;
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
      time,
      date,
    };
  };
}
