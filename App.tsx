import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {Provider} from 'react-redux';
import {store} from './src/redux';
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
      'android.permission.POST_NOTIFICATIONS',
    ]);
  }
};

const App = () => {
  useEffect(() => {
    getPermissions();
    NotificationService.setupFCM();
    NotificationService.onTokenRefresh(fcmToken => {
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
