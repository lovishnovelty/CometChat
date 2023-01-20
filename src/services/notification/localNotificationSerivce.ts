import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, {
  Importance,
  PushNotificationDeliveredObject,
  PushNotificationObject,
  ReceivedNotification,
} from 'react-native-push-notification';
import {CHANNELS} from '../../constants';
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

    this.createChannels();
  };

  static createChannels = () => {
    PushNotification.getChannels(existingChannelIDs => {
      if (!existingChannelIDs.includes(CHANNELS.local.id)) {
        PushNotification.createChannel(
          {
            channelId: CHANNELS.local.id,
            channelName: CHANNELS.local.name,
          },
          created => {},
        );
      }
      if (!existingChannelIDs.includes(CHANNELS.call.id)) {
        PushNotification.createChannel(
          {
            channelId: CHANNELS.call.id,
            channelName: CHANNELS.call.name,
            soundName: 'ringtone.mp3',
            playSound: true,
            importance: Importance.HIGH,
          },
          created => {},
        );
      }
    });
  };

  static onNotificationHandler = (
    notification: Omit<ReceivedNotification, 'userInfo'>,
  ) => {
    ChatNotificaitonHandler.localNotificationTapHandler(notification);
  };

  static onActionHandler = (notification: ReceivedNotification) => {};

  static setLocalNotification = ({
    id,
    title,
    message,
    date,
    payload,
    largeIconUrl,
    tag,
  }: {
    id?: string;
    title: string;
    message: string;
    date?: Date;
    payload?: any;
    largeIconUrl?: string;
    tag?: string;
  }) => {
    const config: PushNotificationObject = {
      id,
      title,
      message,
      channelId: CHANNELS.local.id,
      userInfo: payload,
      largeIconUrl,
      tag,
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

  static removeNotifications = (identifiers: string[], tags?: string[]) => {
    PushNotification.removeDeliveredNotifications(identifiers);
    if (tags) {
      for (let i = 0; i < identifiers.length; i++) {
        PushNotification.clearLocalNotification(tags[i], +identifiers[i]);
      }
    }
  };

  static removeAllNotifications = () => {
    PushNotification.removeAllDeliveredNotifications();
  };

  static getDeliveredNotifications = (
    callback: (notifications: PushNotificationDeliveredObject[]) => void,
  ) => {
    PushNotification.getDeliveredNotifications(callback);
  };
}
