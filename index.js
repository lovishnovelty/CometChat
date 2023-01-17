/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Config from 'react-native-config';
import {CometChat} from '@cometchat-pro/react-native-chat';
import messaging from '@react-native-firebase/messaging';
import {
  ChatNotificaitonHandler,
  NotificationService,
  LocalNotificationServices,
} from './src/services/';

console.log('cc', Config);
var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(Config.REGION)
  .build();

LocalNotificationServices.configure();

CometChat.init(Config.APP_ID, appSetting).then(
  async () => {
    const fcmToken = await messaging().getToken();
    CometChat.registerTokenForPushNotification(fcmToken);
    console.log('Initialization completed successfully');
  },
  error => {
    console.log('Initialization failed with error:', error);
  },
);

// const options = {
//   ios: {
//     appName: 'My app name',
//   },
//   android: {
//     alertTitle: 'Permissions required',
//     alertDescription: 'This application needs to access your phone accounts',
//     cancelButton: 'Cancel',
//     okButton: 'ok',
//     imageName: 'phone_account_icon',

//     foregroundService: {
//       channelId: 'com.cometchatpoc',
//       channelName: 'cometchat',
//       // notificationTitle: 'Title',
//       // notificationIcon: 'Path to the resource icon of the notification',
//     },
//   },
// };
// RNCallKeep.setup(options).then(() => {
//   console.log('rn call keep setup');
// });
// let sessionID = '';
// RNCallKeep.setAvailable(true);
// RNCallKeep.addEventListener('answerCall', () => {
//   RNCallKeep.backToForeground();
//   setTimeout(() => chatService.acceptIncomingCall(sessionID), 2000);
// });
// RNCallKeep.addEventListener('endCall', () => {
//   RNCallKeep.backToForeground();
//   setTimeout(() => chatService.rejectIncomingCall(sessionID), 2000);
// });

// listeners for when the user accepts or reject calls when the app is in background or quit state through notification
ChatNotificaitonHandler.attachListeners();

messaging().setBackgroundMessageHandler(
  NotificationService.backgroundMessageHandler,
);

AppRegistry.registerComponent(appName, () => App);
