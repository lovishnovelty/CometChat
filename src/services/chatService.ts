import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';

class ChatService {
  conversationRequestBuilder: CometChat.ConversationsRequestBuilder;
  constructor() {
    this.conversationRequestBuilder =
      new CometChat.ConversationsRequestBuilder();
  }
  login = async () => {
    try {
      const loggedInUserID = await AsyncStorage.getItem('userID');

      const userId = 'qu3a4eect2jifh';

      // create user if not stored locally
      if (!loggedInUserID) {
        const newUser = new CometChat.User(userId);
        newUser.setName('Test User');
        const data = await CometChat.createUser(newUser, Config.AUTH_KEY ?? '');
        await AsyncStorage.setItem('userID', data.getUid());
      }

      // if already logged in comet chat
      const loggedInUser = await CometChat.getLoggedinUser();
      if (loggedInUser) return loggedInUser;

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

  getChatList = async () => {
    let limit: number = 30;
    const conversationRequest = this.conversationRequestBuilder
      .setLimit(limit)
      .build();
    const chatList = await conversationRequest.fetchNext();

    return chatList.map(convo => ({
      message: convo.getLastMessage().getText(),
    }));
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
