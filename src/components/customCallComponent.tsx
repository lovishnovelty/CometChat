import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {chatService} from '../services';

export const CustomCallComponent = ({
  sessionID,
  onCallEnded,
}: {
  sessionID: string;
  onCallEnded: () => void;
}) => {
  const getSettings = () => {
    return chatService.initiateDirectCall({
      sessionID: sessionID ?? 'abc',
      onCallEnded,
    });
  };

  return (
    <View style={{height: '100%', width: '100%', position: 'relative'}}>
      <CometChat.CallingComponent callsettings={getSettings()} />
    </View>
  );
};
