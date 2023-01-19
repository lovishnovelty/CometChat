import * as React from 'react';
import {Button, Text, View} from 'react-native';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {SizeConfig} from '../config';
import {
  ICallNotificationPayload,
  ICustomIncomingCallProps,
} from '../interfaces/customIncomingCallProps';
import {incomingCallScreenStyles as styles, globalStyles} from '../styles';
import {CustomAvatar} from '../components/customAvatar';
import {CustomDivider} from '../components/customDivider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SPACING} from '../constants';

export const IncomingCallScreen = (props: ICustomIncomingCallProps) => {
  const payload: ICallNotificationPayload = JSON.parse(props.payload);

  return (
    <View style={[globalStyles.container, styles.container]}>
      <CustomDivider size="large" />
      <Text style={globalStyles.heading}>{props.channelName}</Text>
      <CustomDivider />
      <CustomAvatar url="" size={SizeConfig.screenWidth * 0.5} />
      <CustomDivider value={SPACING.margin.xxl} />
      <Text>
        <Text style={globalStyles.title}>{payload.callInitiator}</Text> is
        calling...
      </Text>
      <View style={{flex: 1}} />
      <View style={styles.buttonsContainer}>
        <View>
          <View style={[styles.iconContainer, styles.declineContainer]}>
            <Icon
              name="phone-hangup"
              size={30}
              color={'white'}
              onPress={() => {
                RNNotificationCall.declineCall(props.uuid);
              }}
            />
          </View>
          <Text>Decline</Text>
        </View>
        <View>
          <View style={[styles.iconContainer, styles.answerContainer]}>
            <Icon
              name="phone"
              size={30}
              color={'white'}
              onPress={() => {
                RNNotificationCall.answerCall(props.uuid);
              }}
            />
          </View>
          <Text>Accept</Text>
        </View>
      </View>

      <CustomDivider value={SizeConfig.screenHeight * 0.07} />
    </View>
  );
};
