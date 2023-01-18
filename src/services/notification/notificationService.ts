import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {ChatNotificaitonHandler} from './';

export class NotificationService {
  // when message is received while using the app.
  static foregroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      console.log('foregroundHandler', remoteMessage);
    });
  };

  // when the app was opened from background state by pressing the notification
  static backgroundHandler = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('backgroundHandler', remoteMessage);
    });
  };

  // when the app was opened from quit state by pressing the notification
  static quitStateHandler = () => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log('quitStateHandler', remoteMessage);
      });
  };

  // handler that is run when a notification is received on background state or quit state
  static backgroundMessageHandler = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    ChatNotificaitonHandler.handleNotification(remoteMessage);
  };

  static onTokenRefresh = (listener: (token: string) => any) => {
    messaging().onTokenRefresh(listener);
  };

  static setupFCM = async () => {
    await messaging().requestPermission();

    this.foregroundHandler();
    this.backgroundHandler();
    this.quitStateHandler();
  };
}
