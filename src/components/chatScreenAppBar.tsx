import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/native';
import {IConversation} from '../interfaces';
import {View, Text, Image} from 'react-native';
import {chatScreenAppBarStyles} from '../styles';

export const ChatScreenAppBar = ({
  conversation,
}: {
  conversation: IConversation;
}) => {
  const navigation = useNavigation();

  return (
    <View style={chatScreenAppBarStyles.container}>
      <Icon
        name={'chevron-left'}
        onPress={navigation.goBack}
        size={24}
        color="black"
      />
      <View style={chatScreenAppBarStyles.detailContainer}>
        <Image
          source={{
            uri: conversation.senderAvatar,
          }}
          style={chatScreenAppBarStyles.avatar}
        />
        <Text style={chatScreenAppBarStyles.name} numberOfLines={1}>
          {conversation.senderName}
        </Text>
      </View>
      <Icon
        name={'video-outline'}
        onPress={navigation.goBack}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
      <Icon
        name={'phone'}
        onPress={navigation.goBack}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
      <Icon
        name={'dots-vertical'}
        onPress={navigation.goBack}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
    </View>
  );
};
