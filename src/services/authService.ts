import {CometChat} from '@cometchat-pro/react-native-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {IAuthSlice} from '../interfaces/redux';
import {chatService} from './chatService';

export class AuthService {
  static login = async (name: string) => {
    try {
      let userID = this.createID(5);
      const user = await chatService.login(userID, name);
      const fcmToken = await messaging().getToken();
      CometChat.registerTokenForPushNotification(fcmToken);
      await AsyncStorage.setItem('userID', user.getUid());
      return user;
    } catch (e) {
      throw 'failed to login';
    }
  };

  static restoreAuthState = async (): Promise<IAuthSlice> => {
    const loggedInUserID = await AsyncStorage.getItem('userID');
    const signedOutState = {
      name: '',
      userID: '',
      isSignedIn: false,
    };
    if (loggedInUserID) {
      const user = await CometChat.getLoggedinUser();
      if (user) {
        const fcmToken = await messaging().getToken();
        CometChat.registerTokenForPushNotification(fcmToken);
        return {
          name: user.getName(),
          userID: user.getUid(),
          isSignedIn: true,
        };
      } else {
        return signedOutState;
      }
    } else {
      return signedOutState;
    }
  };

  static createID(length: number) {
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
