/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {
  ChatNotificaitonHandler,
  NotificationService,
  LocalNotificationServices,
  chatService,
} from './src/services/';
import {IncomingCallScreen} from './src/screens';
import firebase from '@react-native-firebase/app';

firebase.initializeApp();

LocalNotificationServices.configure();

chatService.init();

// listeners for when the user accepts or reject calls when the app is in background or quit state through notification
ChatNotificaitonHandler.attachCallListeners();

messaging().setBackgroundMessageHandler(
  NotificationService.backgroundMessageHandler,
);

AppRegistry.registerComponent('incomingCall', () => IncomingCallScreen);
AppRegistry.registerComponent(appName, () => App);
