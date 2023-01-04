import React from 'react';
import {Text, View} from 'react-native';
import {mediaMessageStyles} from '../styles';

export const MediaMessage = ({
  isSentByMe,
  otherUserName,
}: {
  isSentByMe: boolean;
  otherUserName: string;
}) => {
  const initiator = isSentByMe ? 'You' : otherUserName;
  const message = `${initiator} sent a file.`;
  return (
    <View
      style={[
        mediaMessageStyles.container,
        isSentByMe
          ? mediaMessageStyles.sentContainer
          : mediaMessageStyles.receivedContainer,
      ]}>
      <Text style={mediaMessageStyles.message}>{message}</Text>
    </View>
  );
};
