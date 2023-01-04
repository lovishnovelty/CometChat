import React from 'react';
import {View, Text} from 'react-native';
import {CustomAvatar, CustomDivider} from '../components';
import {SizeConfig} from '../config';
import {callingScreenStyles, globalStyles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigation} from '../utils';
import {chatService} from '../services';
import {CometChat} from '@cometchat-pro/react-native-chat';

export const CallingScreen = ({route}: any) => {
  const {sessionID, senderAvatar, senderName} = route.params;

  const onHangup = () => {
    chatService.rejectIncomingCall(sessionID, CometChat.CALL_STATUS.CANCELLED);
    navigation.pop();
  };

  return (
    <View style={[globalStyles.container, callingScreenStyles.container]}>
      <CustomAvatar url={senderAvatar} size={SizeConfig.screenWidth * 0.5} />
      <CustomDivider />
      <Text style={globalStyles.heading}>{senderName}</Text>
      <CustomDivider />
      <Text>Calling...</Text>
      <CustomDivider size="large" />

      <View style={callingScreenStyles.iconContainer}>
        <Icon
          name="phone-hangup"
          size={30}
          color={'white'}
          onPress={onHangup}
        />
      </View>
    </View>
  );
};
