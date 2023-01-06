import React from 'react';
import {IConversation} from '../interfaces';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {recentChatListItemStyles} from '../styles';
import {CustomAvatar} from './customAvatar';

export const ChatListItem = ({
  conversation,
  onPress,
}: {
  conversation: IConversation;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      style={recentChatListItemStyles.container}
      onPress={onPress}>
      <CustomAvatar url={conversation.otherUserAvatar} size={40} />
      <View style={recentChatListItemStyles.detailsContainer}>
        <Text style={recentChatListItemStyles.name}>
          {conversation.otherUserName}
        </Text>
        <Text numberOfLines={2}>
          {conversation.lastMessage.isSentByMe &&
            conversation.lastMessage.isTextMessage &&
            'You: '}
          {conversation.lastMessage.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
