import {CometChat} from '@cometchat-pro/react-native-chat';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {CallActionType, CallType} from '../../../enums';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {name as appName} from '../../../../app.json';
import {chatService} from '../../chatService';

export class ChatNotificaitonHandler {
  private static sessionID: string;
  private static callInitiator: string;

  static async handleNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    try {
      if (!remoteMessage.data) return;
      const message = await CometChat.CometChatHelper.processMessage(
        JSON.parse(remoteMessage.data.message),
      );
      if (!message) return;

      const isCallMessage = message instanceof CometChat.Call;
      if (!isCallMessage) return;

      const callMessage = message as CometChat.Call;
      const callActionType = callMessage.getAction() as CallActionType;
      if (callActionType === CallActionType.INITIATED) {
        this.sessionID = callMessage.getSessionId();
        this.callInitiator = callMessage.getCallInitiator().getName();

        RNNotificationCall.displayNotification(this.sessionID, null, 30000, {
          channelId: 'com.cometchatpoc',
          channelName: 'Incoming video call',
          notificationIcon: 'ic_launcher', //mipmap
          notificationTitle: 'Incoming call',
          notificationBody: `${this.callInitiator} is calling.`,
          answerText: 'Answer',
          declineText: 'Decline',
          notificationColor: 'colorAccent',
          notificationSound: 'skype_ring', //raw
          mainComponent: appName,
        });
      } else {
        RNNotificationCall.declineCall('');
      }
    } catch (e) {
      console.log('error', e);
      return;
    }
  }

  static attachListeners = () => {
    this.listenForAnsweredCall();
    this.listenForRejectedCall();
  };

  private static listenForAnsweredCall = () => {
    RNNotificationCall.addEventListener('answer', () => {
      RNNotificationCall.backToApp();
      setTimeout(() => chatService.acceptIncomingCall(this.sessionID), 0);
    });
  };

  private static listenForRejectedCall = () => {
    RNNotificationCall.addEventListener('endCall', () => {
      chatService.rejectIncomingCall(this.sessionID);
    });
  };
}
