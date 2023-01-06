import React, {useState, useEffect} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {globalStyles} from '../styles';
import {chatService} from '../services';
import {CustomAvatar, CustomDivider} from '../components';
import {IConversation} from '../interfaces';
import {APP_ROUTES} from '../constants';
import {navigation} from '../utils';
import {userStyles} from '../styles';

export const Users = () => {
  const [users, setUsers] = useState<CometChat.User[]>([]);

  useEffect(() => {
    chatService.getUsers().then(users => {
      console.log('usrs', users);

      setUsers(users);
    });
  }, []);

  const onUserPress = (user: CometChat.User) => {
    const conversation: Omit<IConversation, 'lastMessage'> = {
      id: '',
      otherUserID: user.getUid(),
      otherUserName: user.getName(),
      otherUserAvatar: user.getAvatar(),
    };

    navigation.navigate(APP_ROUTES.chatScreen, conversation);
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Users</Text>
      <CustomDivider />
      <FlatList
        data={users}
        contentContainerStyle={{flexGrow: 1}}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              style={userStyles.itemContainer}
              onPress={() => onUserPress(item)}>
              <CustomAvatar url={item.getAvatar()} />
              <CustomDivider axis="horizontal" size="xs" />
              <Text style={[globalStyles.title]}>{item.getName()}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};
