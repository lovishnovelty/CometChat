import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import {IConversation} from '../interfaces';
import {chatService} from '../services/chatService';
import {globalStyles} from '../styles/globalStyles';
import {ChatListItem} from './recentChatListItem';
import {APP_ROUTES} from '../constants';
import {recentChatListStyles} from '../styles';
import {navigation} from '../utils';
import {useAppSelector} from '../redux';

export const RecentChatList = () => {
  const [chatList, setChatList] = useState<IConversation[]>([]);
  const userID = useAppSelector(state => state.auth.userID);
  const onTextMessageReceived = (message: CometChat.TextMessage) => {
    getChatList();
  };

  const getChatList = async () => {
    const chatList = await chatService.getChatList(userID);
    setChatList(chatList);
  };

  const onChatItemPress = (conversation: IConversation) => {
    console.log('pressed', conversation);

    navigation.navigate(APP_ROUTES.chatScreen, conversation);
  };

  useEffect(() => {
    chatService.listenForMessage({
      onTextMessageReceived,
      listenerID: 'recent_chat_list',
    });
    getChatList();
  }, []);

  return (
    <View>
      <Text style={globalStyles.heading}>Recent Chats</Text>
      {chatList.length ? (
        <FlatList
          data={chatList}
          contentContainerStyle={recentChatListStyles.list}
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
      ) : (
        <Text
          style={[globalStyles.title, {marginTop: 100, alignSelf: 'center'}]}>
          No chat found.
        </Text>
      )}
    </View>
  );
};
