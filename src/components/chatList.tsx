import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {IConversation} from '../interfaces';
import {chatService} from '../services/chatService';
import {globalStyles} from '../styles/globalStyles';
import {ChatListItem} from './chatListItem';
import {APP_ROUTES} from '../constants';
import {chatListStyles} from '../styles';
import {navigation} from '../utils';

export const ChatList = () => {
  const [chatList, setChatList] = useState<IConversation[]>([]);

  const onTextMessageReceived = (message: CometChat.TextMessage) => {
    getChatList();
  };

  const getChatList = async () => {
    const chatList = await chatService.getChatList();
    setChatList(chatList);
  };

  const onChatItemPress = (conversation: IConversation) => {
    navigation.navigate(APP_ROUTES.chatScreen, conversation);
  };

  useEffect(() => {
    chatService.initMessageListener({onTextMessageReceived});
    getChatList();
  }, []);

  return (
    <View>
      <Text style={globalStyles.title}>Recent Chats</Text>
      <FlatList
        data={chatList}
        contentContainerStyle={chatListStyles.list}
        renderItem={({item}) => {
          return (
            <ChatListItem
              conversation={item}
              onPress={() => {
                onChatItemPress(item);
              }}
            />
          );
        }}
      />
    </View>
  );
};