import React from 'react';
import {Text, View} from 'react-native';
import {mediaMessageStyles} from '../styles';

export const MediaMessage = ({
  isSentByMe,
  message,
}: {
  isSentByMe: boolean;
  message: string;
}) => {
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
