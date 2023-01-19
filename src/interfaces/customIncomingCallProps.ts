import {customIncomingActivityProps} from 'react-native-full-screen-notification-incoming-call';
import {CallType} from '../enums';

export interface ICustomIncomingCallProps extends customIncomingActivityProps {
  channelId: string;
  channelName: string;
  answerText: string;
  declineText: string;
  notificationColor?: string;
  notificationSound?: string;
  mainComponent?: string;
  info: string;
}

export interface ICallNotificationPayload {
  callType: CallType;
  callInitiator: string;
}
