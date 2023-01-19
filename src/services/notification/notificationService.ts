import messaging, {
  firebase,
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {ChatNotificaitonHandler} from './';

export class NotificationService {
  // when message is received while using the app.
  static foregroundHandler = () => {
    messaging().onMessage(async remoteMessage => {
      ChatNotificaitonHandler.onMessageHandler(remoteMessage);
    });
  };

  // when the app was opened from background state by pressing the notification
  static backgroundHandler = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      ChatNotificaitonHandler.remoteNotificationTapHandler(remoteMessage);
    });
  };

  // when the app was opened from quit state by pressing the notification
  static quitStateHandler = () => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (!remoteMessage) return;
        ChatNotificaitonHandler.remoteNotificationTapHandler(
          remoteMessage,
          true,
        );
      });
  };

  // handler that is run when a notification is received on background state or quit state
  static backgroundMessageHandler = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    ChatNotificaitonHandler.backgroundMessageHandler(remoteMessage);
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
