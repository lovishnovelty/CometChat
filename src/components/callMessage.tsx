import React from 'react';
import {Text, View} from 'react-native';
import {callMessageStyles} from '../styles';

export const CallMessage = ({message}: {message: string}) => {
  return (
    <View style={callMessageStyles.container}>
      <Text style={callMessageStyles.message}>{message}</Text>
    </View>
  );
};
