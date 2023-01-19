import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {Provider} from 'react-redux';
import {store} from './src/redux';
import {NotificationService} from './src/services/notification/notificationService';
import {CometChat} from '@cometchat-pro/react-native-chat';

const App = () => {
  const getPermissions = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');

      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
    }
  };

  const setup = async () => {
    await getPermissions();
    NotificationService.setupFCM();
    NotificationService.onTokenRefresh(fcmToken => {
      CometChat.registerTokenForPushNotification(fcmToken);
    });
  };

  useEffect(() => {
    setup();
  }, []);

  return (
    <Provider store={store}>
      <RootNavigation />
      {/* <IncomingCallScreen /> */}
    </Provider>
  );
};

export default App;
