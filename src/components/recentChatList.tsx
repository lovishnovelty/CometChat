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
import {CustomDivider} from './customDivider';
import {useIsFocused} from '@react-navigation/native';
import {CustomActivityIndicator} from './customActivityIndicator';

export const RecentChatList = () => {
  const isFocused = useIsFocused();
  const [gettingChatList, setGettingChatList] = useState(true);
  const [chatList, setChatList] = useState<IConversation[]>([]);
  const authState = useAppSelector(state => state.auth);
  const onTextMessageReceived = (message: CometChat.TextMessage) => {
    getChatList();
  };

  const getChatList = async () => {
    const chatList = await chatService
      .getChatList(authState.userID)
      .finally(() => {
        setGettingChatList(false);
      });
    setChatList(chatList);
  };

  const onChatItemPress = (conversation: IConversation) => {
    navigation.navigate(APP_ROUTES.chatScreen, conversation);
  };

  useEffect(() => {
    chatService.listenForMessage({
      onTextMessageReceived,
      listenerID: 'recent_chat_list',
    });
  }, []);

  useEffect(() => {
    getChatList();
  }, [isFocused]);

  return (
    <View style={globalStyles.container}>
      <Text style={[globalStyles.heading, {fontSize: 22, fontWeight: '500'}]}>
        Hello {authState.name},
      </Text>
      <CustomDivider />
      <Text style={globalStyles.heading}>Recent Chats</Text>
      {gettingChatList ? (
        <CustomActivityIndicator
          size={'large'}
          style={globalStyles.placeholder}
        />
      ) : chatList.length ? (
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
        <Text style={[globalStyles.title, globalStyles.placeholder]}>
          No chat found.
        </Text>
      )}
    </View>
  );
};
