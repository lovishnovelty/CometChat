import React from 'react';
import {View, Text} from 'react-native';
import {ChatScreenAppBar} from '../components/chatScreenAppBar';
import {IConversation} from '../interfaces';

export const ChatScreen = ({route}: any) => {
  const conversation: IConversation = route.params;

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <ChatScreenAppBar conversation={conversation} />
    </View>
  );
};
