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
import {IncomingCallScreen} from './src/screens';

LocalNotificationServices.configure();

var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(Config.REGION)
  .build();

CometChat.init(Config.APP_ID, appSetting).then(
  async () => {
    console.log('Initialization completed successfully');
  },
  error => {
    console.log('Initialization failed with error:', error);
  },
);

// listeners for when the user accepts or reject calls when the app is in background or quit state through notification
ChatNotificaitonHandler.attachCallListeners();

messaging().setBackgroundMessageHandler(
  NotificationService.backgroundMessageHandler,
);

AppRegistry.registerComponent('incomingCall', () => IncomingCallScreen);
AppRegistry.registerComponent(appName, () => App);
