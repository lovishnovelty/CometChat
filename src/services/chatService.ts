import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {APP_ROUTES} from '../constants';
import {IConversation, IModalHandle} from '../interfaces';
import {IMessage} from '../interfaces/message';
import {AppDispatch, setIncomingCall} from '../redux';
import {ChatUtility, navigation} from '../utils';

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
    onTextMessageReceived,
    listenerID,
  }: {
    onTextMessageReceived: (textMessage: CometChat.TextMessage) => void;
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
        onTextMessageReceived: onTextMessageReceived,
        onMediaMessageReceived: (mediaMessage: CometChat.MediaMessage) => {
          console.log('Media message received successfully', mediaMessage);
        },
        onCustomMessageReceived: (customMessage: CometChat.CustomMessage) => {
          console.log('Custom message received successfully', customMessage);
        },
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
          modalRef.current?.open();
        },
        onIncomingCallCancelled: (cancelledCall: CometChat.Call) => {
          modalRef.current?.close();
        },
        onOutgoingCallAccepted: (acceptedCall: CometChat.Call) => {
          navigation.replace(APP_ROUTES.callScreen, {
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
    navigation.navigate(APP_ROUTES.callScreen, {
      sessionID: acceptedCall.getSessionId(),
    });
  };

  acceptIncomingCallFromBackground = async (sessionId: string) => {
    const acceptedCall = await CometChat.acceptCall(sessionId);
    navigation.reset({
      index: 0,
      routeName: APP_ROUTES.callScreen,
      params: {sessionID: acceptedCall.getSessionId()},
    });
  };

  rejectIncomingCall = (
    sessionId: string,
    callStatus = CometChat.CALL_STATUS.REJECTED,
  ) => {
    return CometChat.rejectCall(sessionId, callStatus);
  };

  removeMessageListener = (listenerID: string) => {
    CometChat.removeMessageListener(listenerID);
  };

  getUsers = async () => {
    const userRequest = this.userRequestBuilder.setLimit(30).build();
    return await userRequest.fetchNext();
  };
}

export const chatService = new ChatService();
