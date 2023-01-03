import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, Text} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {chatService} from './src/services';

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
  const [isLoggingIn, setIsLogginIn] = useState(true);

  useEffect(() => {
    getPermissions();

    chatService.login().then(() => {
      setIsLogginIn(false);
    });
  }, []);

  if (isLoggingIn) return <Text>Loggin in...</Text>;

  return <RootNavigation />;
};

export default App;
