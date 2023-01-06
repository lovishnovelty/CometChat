import React from 'react';
import {Text, View} from 'react-native';
import {textMessageStyles} from '../styles';

export const TextMessage = ({
  message,
  isSentByMe,
}: {
  message: string;
  isSentByMe: boolean;
}) => {
  return (
    <View
      style={[
        textMessageStyles.container,
        isSentByMe
          ? textMessageStyles.sentContainer
          : textMessageStyles.receivedContainer,
      ]}>
      <Text
        style={
          isSentByMe
            ? textMessageStyles.sentMessage
            : textMessageStyles.reveivedMessage
        }>
        {message}
      </Text>
    </View>
  );
};
