/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Config from 'react-native-config';
import {CometChat} from '@cometchat-pro/react-native-chat';

console.log('cc', Config);
var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(Config.REGION)
  .build();

CometChat.init(Config.APP_ID, appSetting).then(
  () => {
    console.log('Initialization completed successfully');
  },
  error => {
    console.log('Initialization failed with error:', error);
  },
);

AppRegistry.registerComponent(appName, () => App);
