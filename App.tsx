import React, {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, Text} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {chatService} from './src/services';
import {Provider} from 'react-redux';
import {signIn, store, useAppDispatch} from './src/redux';

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
  }, []);

  return (
    <Provider store={store}>
      <RootNavigation />
    </Provider>
  );
};

export default App;
