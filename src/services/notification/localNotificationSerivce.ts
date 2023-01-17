import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  PushNotificationObject,
  ReceivedNotification,
} from 'react-native-push-notification';

export class LocalNotificationServices {
  static configure = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        LocalNotificationServices.onNotificationHandler(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
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
  ) => {};

  static setLocalNotification = ({
    id,
    title,
    message,
    date,
  }: {
    id?: string;
    title: string;
    message: string;
    date?: Date;
  }) => {
    const config: PushNotificationObject = {
      id,
      title,
      message,
      channelId: 'local',
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
