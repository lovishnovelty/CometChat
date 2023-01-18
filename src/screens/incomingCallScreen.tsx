import * as React from 'react';
import {Button, Text, View} from 'react-native';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {SizeConfig} from '../config';
import {
  ICallNotificationPayload,
  ICustomIncomingCallProps,
} from '../interfaces/customIncomingCallProps';
import {customIncomingCallStyles as styles, globalStyles} from '../styles';
import {CustomAvatar} from '../components/customAvatar';
import {CustomDivider} from '../components/customDivider';

export const IncomingCallScreen = (props: ICustomIncomingCallProps) => {
  const payload: ICallNotificationPayload = JSON.parse(props.payload);

  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={globalStyles.heading}>{props.channelName}</Text>
      <CustomDivider />

      <CustomAvatar url="" size={SizeConfig.screenWidth * 0.5} />

      <CustomDivider />

      <Text>
        <Text style={globalStyles.title}>{payload.callInitiator}</Text> is
        calling...
      </Text>
      <CustomDivider />
      <View style={styles.buttonsContainer}>
        <Button
          title={props.answerText}
          onPress={() => {
            RNNotificationCall.answerCall(props.uuid);
          }}
          color={'green'}
        />
        <CustomDivider axis="horizontal" />
        <Button
          title={props.declineText}
          onPress={() => {
            RNNotificationCall.declineCall(props.uuid);
          }}
          color={'red'}
        />
      </View>
    </View>
  );
};
