import {CometChat} from '@cometchat-pro/react-native-chat';
import {CallActionType, CallType, ConvoType} from '../enums';
import {
  ICallDetail,
  IConversation,
  IGroup,
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
    try {
      const transformedChatList = chatList.map(convo => {
        const convoWith = convo.getConversationWith();
        // Handle group convo
        if (convoWith instanceof CometChat.Group) {
          const group = convoWith;
          return <IConversation>{
            id: convo.getConversationId(),
            convoType: ConvoType.GROUP,
            lastMessage: this.transformSingleMessage(
              convo.getLastMessage(),
              userID,
            ),
            convoWith: {
              id: group.getGuid(),
              avatar: group.getIcon(),
              name: group.getName(),
            },
          };
        }

        // handle individual convo
        const otherUser = convoWith;
        return <IConversation>{
          id: convo.getConversationId(),
          convoType: ConvoType.USER,
          lastMessage: this.transformSingleMessage(
            convo.getLastMessage(),
            userID,
          ),
          convoWith: {
            id: otherUser.getUid(),
            name: otherUser.getName(),
            avatar: otherUser.getAvatar(),
          },
        };
      });

      return transformedChatList;
    } catch (err: any) {
      return [];
    }
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

    const receiver = message.getReceiver();
    let transformedReceiver: IUser | IGroup;
    if (receiver instanceof CometChat.Group) {
      transformedReceiver = this.transformGroup(receiver);
    } else {
      transformedReceiver = this.transformUser(receiver);
    }

    // call message details
    let callMessage = '';
    let callDetails: ICallDetail | undefined;
    if (isCallMessage) {
      const callType = message.getType() as CallType;
      const callActionType = message.getAction() as CallActionType;
      const isInitiatedByMe = userID === message.getCallInitiator().getUid();

      let receiver: IUser | IGroup;
      const callReceiver = message.getCallReceiver();
      if (callReceiver instanceof CometChat.Group) {
        receiver = this.transformGroup(callReceiver);
      } else {
        receiver = this.transformUser(callReceiver);
      }
      // sender is the user who rejected the call and initiated rejected message
      if (
        callActionType === CallActionType.REJECTED ||
        callActionType === CallActionType.LEFT
      ) {
        receiver = this.transformUser(message.getSender());
      }
      // callActionType === CallActionType.REJECTED
      //   ? this.transformUser(message.getSender() as CometChat.User)
      //   : this.transformUser(message.getCallReceiver() as CometChat.User);
      callDetails = {
        callType,
        callActionType,
        initiator: this.transformUser(message.getCallInitiator()),
        isInitiatedByMe,
        receiver,
        sessionID: message.getSessionId(),
      };
      callMessage = this.getCallMessage(callDetails);
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
      receiver: transformedReceiver,
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

  static getCallMessage = ({
    isInitiatedByMe,
    callActionType,
    callType,
    initiator,
    receiver,
  }: ICallDetail): string => {
    let callMessage = '';
    const article = callType === CallType.AUDIO ? 'an' : 'a';
    const callInitiator = isInitiatedByMe ? 'You' : initiator.name;
    const missedCallUser = isInitiatedByMe ? receiver.name : 'You'; // user who missed the call
    const missedCallMessage = `${missedCallUser} missed ${article} ${callType} call.`;
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
        callMessage = missedCallMessage;
        break;
      case CallActionType.UNANSWERED:
        callMessage = missedCallMessage;
        break;
      case CallActionType.REJECTED:
        callMessage = missedCallMessage;
        break;
      case CallActionType.LEFT:
        callMessage = `${missedCallUser} left the called`;
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
  static transformGroup = (group: CometChat.Group): IGroup => {
    const transformedGroup: IGroup = {
      groupId: group.getGuid(),
      name: group.getName(),
      icon: group.getIcon(),
      description: group.getDescription(),
      memberCount: group.getMembersCount(),
    };
    return transformedGroup;
  };
}
