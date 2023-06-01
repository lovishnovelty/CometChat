import {CometChat} from '@cometchat-pro/react-native-chat';
import React from 'react';
import {View} from 'react-native';
import {callScreenStyles} from '../styles';

export const CallScreen = ({
  callSettings,
}: {
  callSettings: CometChat.CallSettings;
}) => {
  return (
    <View style={callScreenStyles.container}>
      <CometChat.CallingComponent callsettings={callSettings} />
      {/* TODO: Add custom buttonns */}
    </View>
  );
};
