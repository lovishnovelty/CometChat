import React from 'react';
import {Text, View} from 'react-native';
import {callMessageStyles} from '../styles';

export const CallMessage = ({
  isInitiatedByMe,
  isVideo,
  otherUserName,
}: {
  isInitiatedByMe: boolean;
  isVideo: boolean;
  otherUserName: string;
}) => {
  const initiator = isInitiatedByMe ? 'You' : otherUserName;
  const callType = isVideo ? 'video' : 'audio';
  const message = `${initiator} started a ${callType} call`;
  return (
    <View style={callMessageStyles.container}>
      <Text style={callMessageStyles.message}>{message}</Text>
    </View>
  );
};
