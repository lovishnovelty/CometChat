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
    const initiatorName = message.getSender().getName();
    const receiverName = message.getReceiver().getName();
    const messageInitiator = isSentByMe ? 'You' : initiatorName;

    // call message configurations
    let callType: CallType | undefined;
    let callActionType: CallActionType | undefined;
    let callMessage = '';
    if (isCallMessage) {
      callType = message.getType() as CallType;
      callActionType = message.getAction() as CallActionType;
      callMessage = this.getCallMessage(
        callType,
        callActionType,
        initiatorName,
        receiverName,
        isSentByMe,
      );
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
      receiverName,
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

  static getCallMessage = (
    callType: CallType,
    callActionType: CallActionType,
    initiatorName: string,
    receiverName: string,
    isSentByMe: boolean,
  ): string => {
    let callMessage = '';
    const article = callType === CallType.AUDIO ? 'an' : 'a';
    const callInitiator = isSentByMe ? 'You' : initiatorName;
    let missedCallUser = ''; // user who missed the call
    switch (callActionType) {
      case CallActionType.INITIATED:
        callMessage = `${callInitiator} started ${article} ${callType} call.`;
        break;
      case CallActionType.ONGOING:
        callMessage = `Ongoing Call.`;
        break;
      case CallActionType.ENDED:
        callMessage = `${capitalizeInitials(callType)} call ended.`;
        break;
      case CallActionType.CANCELLED:
        missedCallUser = isSentByMe ? receiverName : 'You';
        callMessage = `${missedCallUser} missed ${article} ${callType} call.`;
        break;
      case CallActionType.UNANSWERED:
        missedCallUser = isSentByMe ? receiverName : 'You';
        callMessage = `${missedCallUser} missed ${article} ${callType} call.`;
        break;
      case CallActionType.REJECTED:
        missedCallUser = isSentByMe ? 'You' : receiverName;
        callMessage = `${missedCallUser} missed ${article} ${callType} call.`;
        break;
    }
    return callMessage;
  };
}
