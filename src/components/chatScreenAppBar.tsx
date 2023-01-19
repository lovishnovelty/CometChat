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
import {CometChat} from '@cometchat-pro/react-native-chat';

export const ChatScreenAppBar = ({
  conversation,
}: {
  conversation: IConversation;
}) => {
  const startVideoCall = async () => {
    const call = await chatService.initiateCall({
      receiverID: conversation.otherUserID,
    });

    navigation.navigate(APP_ROUTES.callingScreen, {
      sessionID: call.getSessionId(),
      otherUserAvatar: conversation.otherUserAvatar,
      otherUserName: conversation.otherUserName,
    });
  };

  const startAudioCall = async () => {
    const call = await chatService.initiateCall({
      receiverID: conversation.otherUserID,
      callType: CometChat.CALL_TYPE.AUDIO,
    });

    navigation.navigate(APP_ROUTES.callingScreen, {
      sessionID: call.getSessionId(),
      otherUserAvatar: conversation.otherUserAvatar,
      otherUserName: conversation.otherUserName,
    });
  };

  return (
    <View style={chatScreenAppBarStyles.container}>
      <Icon
        name={'chevron-left'}
        onPress={navigation.goBack}
        size={24}
        color="black"
      />
      <View style={chatScreenAppBarStyles.detailContainer}>
        <CustomAvatar url={conversation.otherUserAvatar} size={35} />
        <CustomDivider axis="horizontal" size="xs" />
        <Text style={chatScreenAppBarStyles.name} numberOfLines={1}>
          {conversation.otherUserName}
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
        onPress={() => {}}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
    </View>
  );
};
