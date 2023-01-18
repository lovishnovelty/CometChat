import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  PushNotificationObject,
  ReceivedNotification,
} from 'react-native-push-notification';
import {ChatNotificaitonHandler} from './handlers';

export class LocalNotificationServices {
  static configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        LocalNotificationServices.onNotificationHandler(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: notification => {
        LocalNotificationServices.onActionHandler(notification);
      },
      // IOS ONLY
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    PushNotification.createChannel(
      {
        channelId: 'local',
        channelName: 'Local Notification',
      },
      () => {},
    );
  };

  static onNotificationHandler = (
    notification: Omit<ReceivedNotification, 'userInfo'>,
  ) => {
    ChatNotificaitonHandler.localNotificationTapHandler(notification);
  };

  static onActionHandler = (notification: ReceivedNotification) => {
    console.log('opened local notification', notification);
  };

  static setLocalNotification = ({
    id,
    title,
    message,
    date,
    payload,
  }: {
    id?: string;
    title: string;
    message: string;
    date?: Date;
    payload?: any;
  }) => {
    const config: PushNotificationObject = {
      id,
      title,
      message,
      channelId: 'local',
      userInfo: payload,
    };

    if (date) {
      PushNotification.localNotificationSchedule({
        ...config,
        date,
      });
    } else {
      PushNotification.localNotification(config);
    }
  };

  static cancelScheduledNotification = (id: string) => {
    PushNotification.cancelLocalNotification(id);
  };
}
