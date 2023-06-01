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
import {ConvoType} from '../enums';

export const ChatScreenAppBar = ({
  conversation,
}: {
  conversation: IConversation;
}) => {
  const {convoWith, convoType} = conversation;
  const startCall = async (callType: string) => {
    const call = await chatService.initiateCall({
      receiverID: convoWith.id,
      callType,
      receiverType:
        convoType === ConvoType.GROUP
          ? CometChat.RECEIVER_TYPE.GROUP
          : CometChat.RECEIVER_TYPE.USER,
    });

    navigation.navigate(APP_ROUTES.callingScreen, {
      sessionID: call.getSessionId(),
      otherUserAvatar: convoWith.avatar,
      otherUserName: convoWith.name,
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
        <CustomAvatar url={convoWith.avatar} size={35} />
        <CustomDivider axis="horizontal" size="xs" />
        <Text style={chatScreenAppBarStyles.name} numberOfLines={1}>
          {convoWith.name}
        </Text>
      </View>
      <Icon
        name={'video-outline'}
        onPress={() => startCall(CometChat.CALL_TYPE.VIDEO)}
        size={24}
        color="black"
        style={chatScreenAppBarStyles.icon}
      />
      <Icon
        name={'phone'}
        onPress={() => startCall(CometChat.CALL_TYPE.AUDIO)}
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
