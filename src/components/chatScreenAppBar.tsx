import React from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IConversation} from '../interfaces';
import {View, Text} from 'react-native';
import {chatScreenAppBarStyles} from '../styles';
import {chatService} from '../services';
import {APP_ROUTES} from '../constants';
import {CustomAvatar} from './customAvatar';
import {CustomDivider} from './customDivider';
import {navigation} from '../utils';

export const ChatScreenAppBar = ({
  conversation,
}: {
  conversation: IConversation;
}) => {
  const startVideoCall = async () => {
    // const call = await chatService.initiateCall({
    //   receiverID: conversation.senderID,
    // });

    navigation.navigate(APP_ROUTES.callingScreen, {
      // sessionID: call.getSessionId(),
      sessionID: '123',
      senderAvatar: conversation.senderAvatar,
      senderName: conversation.senderName,
    });
  };

  const startAudioCall = () => {};

  return (
    <View style={chatScreenAppBarStyles.container}>
      <Icon
        name={'chevron-left'}
        onPress={navigation.goBack}
        size={24}
        color="black"
      />
      <View style={chatScreenAppBarStyles.detailContainer}>
        <CustomAvatar url={conversation.senderAvatar} size={35} />
        <CustomDivider axis="horizontal" size="xs" />
        <Text style={chatScreenAppBarStyles.name} numberOfLines={1}>
          {conversation.senderName}
        </Text>
      </View>
      <Icon
        name={'video-outline'}
        onPress={startVideoCall}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
      <Icon
        name={'phone'}
        onPress={startAudioCall}
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
