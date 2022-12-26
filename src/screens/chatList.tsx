import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {IConversation} from '../interfaces';
import {chatService} from '../services/chatService';

export const ChatList = () => {
  const [chatList, setChatList] = useState<IConversation[]>([]);

  const onTextMessageReceived = (message: CometChat.TextMessage) => {
    console.log(message);
  };

  const getChatList = async () => {
    const chatList = await chatService.getChatList();
    setChatList(chatList);
  };

  useEffect(() => {
    chatService.login().then(() => {
      chatService.initMessageListener({onTextMessageReceived});
      getChatList();
    });
  }, []);

  return (
    <FlatList
      data={chatList}
      renderItem={({item}) => {
        return <Text>{item.message}</Text>;
      }}
    />
  );
};
