import React from 'react';
import {IConversation} from '../interfaces';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {chatListItemStyles} from '../styles';

export const ChatListItem = ({
  conversation,
  onPress,
}: {
  conversation: IConversation;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity style={chatListItemStyles.container} onPress={onPress}>
      <Image
        source={{
          uri: conversation.senderAvatar,
        }}
        style={chatListItemStyles.avatar}
      />
      <View style={chatListItemStyles.detailsContainer}>
        <Text style={chatListItemStyles.name}>{conversation.senderName}</Text>
        <Text>{conversation.message}</Text>
      </View>
    </TouchableOpacity>
  );
};
