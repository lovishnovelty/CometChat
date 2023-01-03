import React from 'react';
import {View, Text} from 'react-native';
import {CustomAvatar, CustomDivider} from '../components';
import {SizeConfig} from '../config';
import {callingScreenStyles, globalStyles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {navigation} from '../utils';

export const CallingScreen = ({route}: any) => {
  const {sessionID, senderAvatar, senderName} = route.params;

  const onHangup = () => {
    navigation.goBack();
  };

  return (
    <View style={[globalStyles.container, callingScreenStyles.container]}>
      <CustomAvatar url={senderAvatar} size={SizeConfig.screenWidth * 0.5} />
      <CustomDivider />
      <Text style={globalStyles.title}>{senderName}</Text>
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
