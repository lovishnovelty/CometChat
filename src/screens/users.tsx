import React, {useState, useEffect} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {globalStyles} from '../styles';
import {chatService} from '../services';
import {
  CustomActivityIndicator,
  CustomAvatar,
  CustomDivider,
} from '../components';
import {IConversation} from '../interfaces';
import {APP_ROUTES} from '../constants';
import {navigation} from '../utils';
import {userStyles} from '../styles';
import {useIsFocused} from '@react-navigation/native';

export const Users = () => {
  const [gettingUsers, setGettingUsers] = useState(true);
  const [users, setUsers] = useState<CometChat.User[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    chatService
      .getUsers()
      .then(users => {
        setUsers(users);
      })
      .finally(() => {
        setGettingUsers(false);
      });
  }, [isFocused]);

  const onUserPress = (user: CometChat.User) => {
    const conversation: Omit<IConversation, 'lastMessage'> = {
      // id will be set in Chat screen
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
      <CustomDivider size="xs" />
      {gettingUsers ? (
        <CustomActivityIndicator
          style={globalStyles.placeholder}
          size={'large'}
        />
      ) : users.length ? (
        <FlatList
          data={users}
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
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
      ) : (
        <Text style={[globalStyles.title, globalStyles.placeholder]}>
          No users found.
        </Text>
      )}
    </View>
  );
};
