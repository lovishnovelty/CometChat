import React from 'react';
import {IConversation} from '../interfaces';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {chatListItemStyles} from '../styles';
import {CustomAvatar} from './customAvatar';

export const ChatListItem = ({
  conversation,
  onPress,
}: {
  conversation: IConversation;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={chatListItemStyles.container} onPress={onPress}>
      <CustomAvatar url={conversation.senderAvatar} size={40} />
      <View style={chatListItemStyles.detailsContainer}>
        <Text style={chatListItemStyles.name}>{conversation.senderName}</Text>
        <Text>{conversation.message}</Text>
      </View>
    </TouchableOpacity>
  );
};
