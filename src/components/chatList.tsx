import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {IConversation} from '../interfaces';
import {chatService} from '../services/chatService';
import {globalStyles} from '../styles/globalStyles';
import {ChatListItem} from './chatListItem';
import {CustomDivider} from './customDivider';
import {useNavigation} from '@react-navigation/native';
import {APP_ROUTES} from '../constants';
import {chatListStyles} from '../styles';

export const ChatList = () => {
  const navigation: any = useNavigation();
  const [chatList, setChatList] = useState<IConversation[]>([]);

  const onTextMessageReceived = (message: CometChat.TextMessage) => {
    getChatList();
  };

  const getChatList = async () => {
    const chatList = await chatService.getChatList();
    setChatList(chatList);
  };

  const onChatItemPress = () => {
    navigation.navigate(APP_ROUTES.chatScreen);
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
          return <ChatListItem conversation={item} onPress={onChatItemPress} />;
        }}
      />
    </View>
  );
};
