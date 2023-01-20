import {CometChat} from '@cometchat-pro/react-native-chat';
import {CallActionType, CallType} from '../enums';
import {
  ICallDetail,
  IConversation,
  IMediaDetail,
  IMessage,
  IUser,
} from '../interfaces';
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
    const messageInitiator = isSentByMe ? 'You' : message.getSender().getName();
    const sender = this.transformUser(message.getSender());
    const receiver = this.transformUser(
      message.getReceiver() as CometChat.User,
    );

    // call message details
    let callMessage = '';
    let callDetails: ICallDetail | undefined;
    if (isCallMessage) {
      const callType = message.getType() as CallType;
      const callActionType = message.getAction() as CallActionType;
      const isInitiatedByMe = userID === message.getCallInitiator().getUid();

      // sender is the user who rejected the call and initiated rejected message
      const receiver =
        callActionType === CallActionType.REJECTED
          ? this.transformUser(message.getSender() as CometChat.User)
          : this.transformUser(message.getCallReceiver() as CometChat.User);
      callDetails = {
        callType,
        callActionType,
        initiator: this.transformUser(message.getCallInitiator()),
        receiver,
        isInitiatedByMe,
        sessionID: message.getSessionId(),
      };
      callMessage = this.getCallMessage(callDetails, isInitiatedByMe);
    }

    // media message details
    const mediaMessage = `${messageInitiator} sent a file.`;
    let mediaDetails: IMediaDetail | undefined;
    mediaDetails = {};

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
      sender,
      receiver,
      isSentByMe,
      isTextMessage,
      isCallMessage,
      isMediaMessage,
      callDetails,
      mediaDetails,
      time,
      date,
    };
  };

  static getCallMessage = (
    callDetails: ICallDetail,
    isInitiatedByMe: boolean,
  ): string => {
    let callMessage = '';
    const article = callDetails.callType === CallType.AUDIO ? 'an' : 'a';
    const callInitiator = isInitiatedByMe ? 'You' : callDetails.initiator.name;
    const missedCallUser = isInitiatedByMe ? callDetails.receiver.name : 'You'; // user who missed the call
    const missedCallMessage = `${missedCallUser} missed ${article} ${callDetails.callType} call.`;
    switch (callDetails.callActionType) {
      case CallActionType.INITIATED:
        callMessage = `${callInitiator} started ${article} ${callDetails.callType} call.`;
        break;
      case CallActionType.ONGOING:
        callMessage = `Ongoing Call.`;
        break;
      case CallActionType.ENDED:
        callMessage = `${capitalizeInitials(callDetails.callType)} call ended.`;
        break;
      case CallActionType.CANCELLED:
        callMessage = missedCallMessage;
        break;
      case CallActionType.UNANSWERED:
        callMessage = missedCallMessage;
        break;
      case CallActionType.REJECTED:
        callMessage = missedCallMessage;
        break;
    }
    return callMessage;
  };

  static transformUser = (user: CometChat.User): IUser => {
    const transformedUser: IUser = {
      id: user.getUid(),
      name: user.getName(),
      avatar: user.getAvatar(),
    };
    return transformedUser;
  };
}
