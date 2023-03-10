import {CometChat} from '@cometchat-pro/react-native-chat';
import React from 'react';
import {View} from 'react-native';
import {chatService} from '../services';
import {navigation} from '../utils';

export const CallScreen = ({route}: any) => {
  const {sessionID} = route.params;
  const getSettings = () => {
    return chatService.joinCall({
      sessionID: sessionID ?? 'abc',
      onCallEnded: navigation.pop,
    });
  };

  return (
    <View style={{height: '100%', width: '100%', position: 'relative'}}>
      <CometChat.CallingComponent callsettings={getSettings()} />
    </View>
  );
};
