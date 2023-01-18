import {CometChat} from '@cometchat-pro/react-native-chat';
import {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {CallActionType, CallType} from '../../../enums';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {name as appName} from '../../../../app.json';
import {chatService} from '../../chatService';
import {ICallNotificationPayload} from '../../../interfaces/customIncomingCallProps';

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
          channelId: 'com.cometchatpoc',
          channelName: `Incoming ${callType} call`,
          notificationIcon: 'ic_launcher', //mipmap
          notificationTitle: 'Incoming call',
          notificationBody: `${this.callInitiator} is calling.`,
          answerText: 'Answer',
          declineText: 'Decline',
          // notificationColor: 'colorAccent',
          // notificationSound: 'skype_ring', //raw
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

  static attachListeners = () => {
    this.listenForAnsweredCall();
    this.listenForRejectedCall();
  };

  private static listenForAnsweredCall = () => {
    RNNotificationCall.addEventListener('answer', () => {
      RNNotificationCall.backToApp();
      chatService.acceptIncomingCall(this.sessionID);
    });
  };

  private static listenForRejectedCall = () => {
    RNNotificationCall.addEventListener('endCall', () => {
      chatService.rejectIncomingCall(this.sessionID);
    });
  };
}
