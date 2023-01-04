import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import {APP_ROUTES} from '../constants';
import {IConversation, IModalHandle} from '../interfaces';
import {AppDispatch, setIncomingCall} from '../redux';
import {navigation} from '../utils';

class ChatService {
  conversationRequestBuilder: CometChat.ConversationsRequestBuilder;
  callSettingsBuilder: CometChat.CallSettingsBuilder;

  constructor() {
    this.conversationRequestBuilder =
      new CometChat.ConversationsRequestBuilder();
    this.callSettingsBuilder = new CometChat.CallSettingsBuilder();
  }
  login = async () => {
    try {
      const loggedInUserID = await AsyncStorage.getItem('userID');

      let userId = this.createID(5);

      // create user if not stored locally
      if (loggedInUserID) {
        userId = loggedInUserID;
      } else {
        console.log('Creating user...');

        const newUser = new CometChat.User(userId);
        newUser.setName('Hari Lama');
        const data = await CometChat.createUser(newUser, Config.AUTH_KEY ?? '');
        await AsyncStorage.setItem('userID', data.getUid());
      }
      // if already logged in comet chat
      const loggedInUser = await CometChat.getLoggedinUser();
      if (loggedInUser) return loggedInUser;

      console.log('logging in', userId);
      // login to comet chat
      const user = await CometChat.login(userId, Config.AUTH_KEY);
      await AsyncStorage.setItem('userID', user.getUid());
      console.log('User logged in:', user);
      return user;
    } catch (e) {
      console.log('Failed to login:', e);
    }
  };

  initMessageListener = async ({
    onTextMessageReceived,
  }: {
    onTextMessageReceived: (textMessage: CometChat.TextMessage) => void;
  }) => {
    const userId = await AsyncStorage.getItem('userID');

    if (!userId) {
      console.log('Failed to initialize message listener: User not logged in.');
      return;
    }
    CometChat.addMessageListener(
      userId,
      new CometChat.MessageListener({
        onTextMessageReceived: onTextMessageReceived,
      }),
    );
  };

  getChatList = async (): Promise<IConversation[]> => {
    let limit: number = 30;
    const conversationRequest = this.conversationRequestBuilder
      .setLimit(limit)
      .build();
    const chatList = await conversationRequest.fetchNext();

    return chatList.map(convo => {
      const sender = convo.getConversationWith() as CometChat.User;
      return {
        message: 'convo.getLastMessage().getText()',
        senderName: sender.getName(),
        senderAvatar:
          sender.getAvatar() ??
          'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        senderID: sender.getUid(),
        date: '2022',
      };
    });
  };

  sendTextMessage = async ({
    receiverType = CometChat.RECEIVER_TYPE.USER,
    receiverID,
    message,
  }: {
    receiverType?: string;
    receiverID: string;
    message: string;
  }) => {
    const textMessage = new CometChat.TextMessage(
      receiverID,
      message,
      receiverType,
    );
    try {
      const sentMessage = await CometChat.sendMessage(textMessage);
      return sentMessage;
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
          console.log('inititator', incomingCall.getCallInitiator());
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

  rejectIncomingCall = (
    sessionId: string,
    callStatus = CometChat.CALL_STATUS.REJECTED,
  ) => {
    return CometChat.rejectCall(sessionId, callStatus);
  };

  createID(length: number) {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

export const chatService = new ChatService();
