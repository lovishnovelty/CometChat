import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, Text} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {chatService} from './src/services';
import {Provider} from 'react-redux';
import {signIn, store, useAppDispatch} from './src/redux';
import {NotificationService} from './src/services/notification/notificationService';
import messaging from '@react-native-firebase/messaging';
import {CometChat} from '@cometchat-pro/react-native-chat';
const getPermissions = async () => {
  if (Platform.OS === 'android') {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
  }
};

const App = () => {
  useEffect(() => {
    getPermissions();
    NotificationService.setupFCM();
    messaging().onTokenRefresh(fcmToken => {
      CometChat.registerTokenForPushNotification(fcmToken);
    });
  }, []);

  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
