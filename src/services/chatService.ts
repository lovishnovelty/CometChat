import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {APP_ROUTES} from '../constants';
import {CallStatus} from '../enums';
import {IConversation, IModalHandle, IMessage} from '../interfaces';
import {AppDispatch, setIncomingCall} from '../redux';
import {ChatUtility, navigation} from '../utils';
import {ChatNotificaitonHandler} from './notification';

class ChatService {
  conversationRequestBuilder: CometChat.ConversationsRequestBuilder;
  messageRequestBuilder: CometChat.MessagesRequestBuilder;
  callSettingsBuilder: CometChat.CallSettingsBuilder;
  userRequestBuilder: CometChat.UsersRequestBuilder;

  constructor() {
    this.conversationRequestBuilder =
      new CometChat.ConversationsRequestBuilder();
    this.callSettingsBuilder = new CometChat.CallSettingsBuilder();
    this.messageRequestBuilder = new CometChat.MessagesRequestBuilder();
    this.userRequestBuilder = new CometChat.UsersRequestBuilder();
  }

  init = () => {
    var appSetting = new CometChat.AppSettingsBuilder()
      .subscribePresenceForAllUsers()
      .setRegion(Config.REGION)
      .build();

    CometChat.init(Config.APP_ID, appSetting).then(
      async () => {
        console.log('Chat service initialized successfully.');
      },
      error => {
        console.log('Chat service initialization failed with error:', error);
      },
    );
  };

  login = async (userID: string, name: string) => {
    try {
      const newUser = new CometChat.User(userID);
      newUser.setName(name);
      await CometChat.createUser(newUser, Config.AUTH_KEY ?? '');
      const user = await CometChat.login(userID, Config.AUTH_KEY);

      console.log('User logged in:', user);
      return user;
    } catch (e) {
      console.log('Failed to login:', e);
      throw e;
    }
  };

  listenForMessage = async ({
    onMessageReceived,
    listenerID,
    onTypingStarted,
    onTypingEnded,
  }: {
    onMessageReceived: (message: IMessage) => void;
    onTypingStarted?: (typingIndicator: CometChat.TypingIndicator) => void;
    onTypingEnded?: (typingIndicator: CometChat.TypingIndicator) => void;
    listenerID: string;
  }) => {
    const userId = await AsyncStorage.getItem('userID');

    if (!userId) {
      console.log('Failed to initialize message listener: User not logged in.');
      return;
    }
    CometChat.addMessageListener(
      listenerID,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: CometChat.TextMessage) => {
          console.log('received');

          onMessageReceived(
            ChatUtility.transformSingleMessage(textMessage, userId),
          );
        },
        onMediaMessageReceived: (mediaMessage: CometChat.MediaMessage) => {
          onMessageReceived(
            ChatUtility.transformSingleMessage(mediaMessage, userId),
          );
        },
        onCustomMessageReceived: (customMessage: CometChat.CustomMessage) => {
          onMessageReceived(
            ChatUtility.transformSingleMessage(customMessage, userId),
          );
        },
        onTypingStarted,
        onTypingEnded,
      }),
    );
  };

  getChatList = async (userID: string): Promise<IConversation[]> => {
    let limit: number = 30;
    const conversationRequest = this.conversationRequestBuilder
      .setLimit(limit)
      .build();

    // return fetchNext function so that it can be called on scroll
    const chatList = await conversationRequest.fetchNext();
    return ChatUtility.transformChatList(chatList, userID);
  };

  getMessagesByUID = async (userID: string, otherUserID: string) => {
    let limit = 30;
    const messageRequest = this.messageRequestBuilder
      .setLimit(limit)
      .setUID(otherUserID)
      .build();

    const messageList = await messageRequest.fetchPrevious().catch(err => {
      console.log(err);
      return [];
    });
    return ChatUtility.transformMessages(messageList, userID);
  };

  sendTextMessage = async ({
    userID,
    receiverType = CometChat.RECEIVER_TYPE.USER,
    receiverID,
    message,
  }: {
    userID: string;
    receiverType?: string;
    receiverID: string;
    message: string;
  }): Promise<IMessage> => {
    const textMessage = new CometChat.TextMessage(
      receiverID,
      message,
      receiverType,
    );
    try {
      const sentMessage = await CometChat.sendMessage(textMessage);
      return ChatUtility.transformSingleMessage(sentMessage, userID);
    } catch (err) {
      throw 'Failed to send message';
    }
  };

  joinCall = ({
    sessionID,
    audioOnly = false,
    onCallEnded,
    onUserJoined,
    onUserListUpdated,
  }: {
    sessionID: string;
    audioOnly?: boolean;
    onUserJoined?: (user: CometChat.User) => void;
    onUserLeft?: (user: CometChat.User) => void;
    onCallEnded?: (call: CometChat.Call) => void;
    onUserListUpdated?: (userList: CometChat.User[]) => void;
  }) => {
    const callListener = new CometChat.OngoingCallListener({
      onUserJoined,
      onUserListUpdated,
      onCallEnded,
      onError: (error: CometChat.CometChatException) => {
        console.log('Call Error: ', error);
      },
      onAudioModesUpdated: (audioModes: CometChat.AudioMode[]) => {
        console.log('audio modes:', audioModes);
      },
    });

    return this.callSettingsBuilder
      .setSessionID(sessionID)
      .setIsAudioOnlyCall(audioOnly)
      .setDefaultAudioMode(CometChat.AUDIO_MODE.SPEAKER)
      .setCallEventListener(callListener)
      .build();
  };

  initiateCall = ({
    receiverID,
    callType = CometChat.CALL_TYPE.VIDEO,
    receiverType = CometChat.RECEIVER_TYPE.USER,
  }: {
    receiverID: string;
    callType?: string;
    receiverType?: string;
  }) => {
    const call = new CometChat.Call(receiverID, callType, receiverType);

    return CometChat.initiateCall(call);
  };

  listenForCall = (
    modalRef: React.RefObject<IModalHandle>,
    dispatch: AppDispatch,
  ) => {
    CometChat.addCallListener(
      'listnerId',
      new CometChat.CallListener({
        onIncomingCallReceived: (incomingCall: CometChat.Call) => {
          dispatch(
            setIncomingCall({
              incomingCallID: incomingCall.getSessionId(),
              incomingCallInitiator: {
                name: incomingCall.getCallInitiator().getName(),
                avatar: incomingCall.getCallInitiator().getAvatar(),
              },
            }),
          );

          // move this back to ui
          modalRef.current?.open();
        },
        onIncomingCallCancelled: (cancelledCall: CometChat.Call) => {
          modalRef.current?.close();
        },
        onOutgoingCallAccepted: (acceptedCall: CometChat.Call) => {
          navigation.replace(APP_ROUTES.directCall, {
            sessionID: acceptedCall.getSessionId(),
          });
        },
        onOutgoingCallRejected: (rejectedCall: CometChat.Call) => {
          navigation.pop();
        },
      }),
    );
  };

  acceptIncomingCall = async (sessionId: string) => {
    const acceptedCall = await CometChat.acceptCall(sessionId);
    // Remove the incoming call notification from notification tray
    ChatNotificaitonHandler.removeCallNotification(
      CallStatus.INCOMING,
      acceptedCall.getCallInitiator().getName(),
    );
    navigation.navigate(APP_ROUTES.directCall, {
      sessionID: acceptedCall.getSessionId(),
    });
  };

  acceptIncomingCallFromBackground = async (sessionId: string) => {
    const acceptedCall = await CometChat.acceptCall(sessionId);
    navigation.reset({
      index: 0,
      routeName: APP_ROUTES.directCall,
      params: {sessionID: acceptedCall.getSessionId()},
    });
  };

  rejectIncomingCall = async (
    sessionId: string,
    callStatus = CometChat.CALL_STATUS.REJECTED,
  ) => {
    const rejectedCall = await CometChat.rejectCall(sessionId, callStatus);
    // Remove the incoming call notification from notification tray
    ChatNotificaitonHandler.removeCallNotification(
      CallStatus.INCOMING,
      rejectedCall.getCallInitiator().getName(),
    );
  };

  removeMessageListener = (listenerID: string) => {
    CometChat.removeMessageListener(listenerID);
  };

  getUsers = async () => {
    const userRequest = this.userRequestBuilder.setLimit(30).build();
    return await userRequest.fetchNext();
  };

  startTyping = (receiverID: string) => {
    const typingNotification = new CometChat.TypingIndicator(
      receiverID,
      CometChat.RECEIVER_TYPE.USER,
    );
    CometChat.startTyping(typingNotification);
  };

  endTyping = (receiverID: string) => {
    const typingNotification = new CometChat.TypingIndicator(
      receiverID,
      CometChat.RECEIVER_TYPE.USER,
    );
    CometChat.endTyping(typingNotification);
  };

  createGroup = async ({
    groupId,
    groupName,
    adminIds,
    moderatorIds,
    participantIds,
    banMembers,
  }: {
    groupId: string;
    groupName: string;
    adminIds: string[];
    moderatorIds: string[];
    participantIds: string[];
    banMembers: string[];
  }) => {
    try {
      const group = new CometChat.Group(
        groupId,
        groupName,
        CometChat.GROUP_TYPE.PUBLIC,
      );
      const members: CometChat.GroupMember[] = [];

      for (let id of adminIds) {
        members.push(
          new CometChat.GroupMember(id, CometChat.GROUP_MEMBER_SCOPE.ADMIN),
        );
      }
      for (let id of moderatorIds) {
        members.push(
          new CometChat.GroupMember(id, CometChat.GROUP_MEMBER_SCOPE.MODERATOR),
        );
      }
      for (let id of participantIds) {
        members.push(
          new CometChat.GroupMember(
            id,
            CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT,
          ),
        );
      }
      const createdGroupObj = await CometChat.createGroupWithMembers(
        group,
        members,
        banMembers,
      );
      CometChat.Group;
      console.log('group createed ====>', createdGroupObj);
    } catch (err) {
      console.log('err white creating group', err);
    }
  };
}

export const chatService = new ChatService();
