import {CometChat} from '@cometchat-pro/react-native-chat';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {CallActionType, CallStatus, CallType} from '../../../enums';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import RNCallKeep from 'react-native-callkeep';
import {chatService} from '../../chatService';
import {ICallNotificationPayload} from '../../../interfaces/customIncomingCallProps';
import {LocalNotificationServices} from '../localNotificationSerivce';
import {ChatUtility, navigation, wait} from '../../../utils';
import {ReceivedNotification} from 'react-native-push-notification';
import {APP_ROUTES} from '../../../constants';
import {IConversation} from '../../../interfaces';
import {store} from '../../../redux';

export class ChatNotificaitonHandler {
  private static sessionID: string;
  private static callInitiator: string;

  static async backgroundMessageHandler(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    try {
      if (!remoteMessage.data) return;
      const message = await CometChat.CometChatHelper.processMessage(
        JSON.parse(remoteMessage.data.message),
      );
      if (!message) return;

      const isCallMessage = message instanceof CometChat.Call;
      // Remove previous incoming call notification from notification tray
      this.removeCallNotification(
        CallStatus.INCOMING,
        message.getSender().getName(),
      );
      if (!isCallMessage) return;

      const callMessage = message as CometChat.Call;
      const callType = callMessage.getType() as CallType;
      const callActionType = callMessage.getAction() as CallActionType;
      if (callActionType === CallActionType.INITIATED) {
        this.sessionID = callMessage.getSessionId();
        this.callInitiator = callMessage.getCallInitiator().getName();

        const payload: ICallNotificationPayload = {
          callType,
          callInitiator: this.callInitiator,
        };

        RNNotificationCall.displayNotification(this.sessionID, null, 30000, {
          channelId: 'com.cometchatpoc.noti',
          channelName: `Incoming ${callType} call`,
          notificationIcon: 'ic_launcher', //mipmap
          notificationTitle: `Incoming ${callType} call`,
          notificationBody: `${this.callInitiator} is calling.`,
          answerText: 'Answer',
          declineText: 'Decline',
          notificationColor: 'colorAccent',
          notificationSound: 'ringtone',
          mainComponent: 'incomingCall',
          payload: JSON.stringify(payload),
        });
      } else {
        RNNotificationCall.declineCall('');
      }
    } catch (e) {
      console.log('error', e);
      return;
    }
  }

  static onMessageHandler = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) => {
    try {
      if (!remoteMessage.data) return;
      const msg = await CometChat.CometChatHelper.processMessage(
        JSON.parse(remoteMessage.data.message),
      );
      if (!msg) return;
      const message = ChatUtility.transformSingleMessage(
        msg,
        msg.getReceiverId(),
      );
      // Remove the incoming call notification from notification tray
      this.removeCallNotification(
        CallStatus.INCOMING,
        msg.getSender().getName(),
      );
      if (message.isCallMessage) return;
      const otherUser = msg.getSender();

      const currentRoute = navigation.getCurrentRouteName();
      const currentChatUserID = store.getState().call.currentChatUserID;

      // remove the notification from firebase from notification tray
      this.removeFirebaseNotificationByDescription(
        remoteMessage.notification?.title ?? '',
        remoteMessage.notification?.body ?? '',
        otherUser.getUid(),
      );

      if (
        currentRoute.name === APP_ROUTES.chatScreen &&
        msg.getSender().getUid() === currentChatUserID
      )
        return;

      LocalNotificationServices.setLocalNotification({
        tag: otherUser.getUid(),
        title: message.initiatorName,
        message: message.text,
        largeIconUrl:
          otherUser.getAvatar() ??
          'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
        payload: {
          navigationProps: {
            // id will be set in Chat screen
            id: '',
            otherUserID: otherUser.getUid(),
            otherUserName: otherUser.getName(),
            otherUserAvatar: otherUser.getAvatar(),
          },
          navigate: true,
        },
      });
    } catch (e) {
      console.log('error', e);
      return;
    }
  };

  static remoteNotificationTapHandler = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
    isFromQuitState = false,
  ) => {
    try {
      if (!remoteMessage.data) return;
      const message = await CometChat.CometChatHelper.processMessage(
        JSON.parse(remoteMessage.data.message),
      );
      if (!message) return;

      const otherUser = message.getSender();
      const conversation: Omit<IConversation, 'lastMessage'> = {
        // id will be set in Chat screen
        id: '',
        otherUserID: otherUser.getUid(),
        otherUserName: otherUser.getName(),
        otherUserAvatar: otherUser.getAvatar(),
      };

      // wait for navigation container to me initialized after restoring auth state
      if (isFromQuitState) await wait(1000);
      navigation.navigate(APP_ROUTES.chatScreen, conversation);
    } catch (e) {
      console.log('error', e);
      return;
    }
  };

  static localNotificationTapHandler = (
    notification: Omit<ReceivedNotification, 'userInfo'>,
  ) => {
    const navigationProps = notification.data.navigationProps;
    const navigate: boolean = notification.data.navigate;

    if (!navigate) return;
    navigation.push(APP_ROUTES.chatScreen, navigationProps);
  };

  static attachCallListeners = () => {
    this.listenForAnsweredCall();
    this.listenForRejectedCall();
  };

  private static listenForAnsweredCall = () => {
    RNNotificationCall.addEventListener('answer', () => {
      // RNNotificationCall.backToApp();
      RNCallKeep.backToForeground();
      chatService.acceptIncomingCall(this.sessionID);
    });
  };

  private static listenForRejectedCall = () => {
    RNNotificationCall.addEventListener('endCall', () => {
      chatService.rejectIncomingCall(this.sessionID);
    });
  };

  static removeNotificationsByUserName = (userName: string) => {
    LocalNotificationServices.getDeliveredNotifications(notifications => {
      const userNotifications = notifications.filter(notification => {
        return (
          notification.title === userName ||
          notification.body === null ||
          notification.title === null
        );
      });
      const identifiers = userNotifications.map(
        notification => notification.identifier,
      );
      const tags = userNotifications.map(notification => notification.tag);
      LocalNotificationServices.removeNotificaitons(identifiers, tags);
    });
  };

  static removeFirebaseNotificationByDescription = (
    title: string,
    body: string,
    userId: string,
  ) => {
    LocalNotificationServices.getDeliveredNotifications(notifications => {
      const notificationsToRemove = notifications.filter(notification => {
        return (
          notification.title === title &&
          // tag is set to id of sender when setting local noitification which is not present in firebase's notification
          notification.tag !== userId &&
          notification.body === body
        );
      });

      const identifiers = notificationsToRemove.map(
        notification => notification.identifier,
      );
      LocalNotificationServices.removeNotificaitons(identifiers);
    });
  };

  static removeCallNotification = (callType: CallStatus, userName?: string) => {
    LocalNotificationServices.getDeliveredNotifications(notifications => {
      const notificationsToRemove = notifications.filter(notification => {
        const isIncomingCall =
          notification.body === 'Incoming audio call' ||
          notification.body === 'Incoming video call';
        const isSelectedUsersCall = userName
          ? userName === notification.title
          : true;
        return isIncomingCall && isSelectedUsersCall;
      });

      const identifiers = notificationsToRemove.map(
        notification => notification.identifier,
      );
      const tags = notificationsToRemove.map(notification => notification.tag);
      LocalNotificationServices.removeNotificaitons(identifiers, tags);
    });
  };
}
