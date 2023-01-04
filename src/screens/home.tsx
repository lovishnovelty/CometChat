import React, {useState, useEffect, useRef} from 'react';
import {Text, View, TextInput, Button} from 'react-native';
import {ChatList, CustomAvatar, CustomDivider} from '../components';
import {CustomModal} from '../components/customModal';
import {APP_ROUTES} from '../constants';
import {IModalHandle} from '../interfaces';
import {useAppDispatch, useAppSelector} from '../redux';
import {chatService} from '../services';
import {globalStyles, homeStyles} from '../styles';
import {navigation} from '../utils';

export const Home = () => {
  const [sessionID, setSessionID] = useState('');
  const incomingCallModalRef = useRef<IModalHandle>(null);

  const {incomingCallInitiator, incomingCallID} = useAppSelector(
    state => state.call,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    chatService.listenForCall(incomingCallModalRef, dispatch);
  }, []);

  return (
    <View style={globalStyles.container}>
      <CustomModal ref={incomingCallModalRef}>
        <Text style={globalStyles.heading}>Incoming call.</Text>
        <CustomDivider size="xs" />
        <View style={homeStyles.detailContainer}>
          <CustomAvatar url={incomingCallInitiator.avatar} size={50} />
          <CustomDivider size="xs" axis="horizontal" />

          <View>
            <Text style={globalStyles.title}>{incomingCallInitiator.name}</Text>
            <Text>is Calling...</Text>
          </View>
        </View>
        <View>
          <Button
            title="Accept"
            onPress={() => {
              incomingCallModalRef.current?.close();
              chatService.acceptIncomingCall(incomingCallID);
            }}
          />
          <CustomDivider size="xs" />
          <Button
            title="Reject"
            onPress={() => {
              chatService.rejectIncomingCall(incomingCallID);
              incomingCallModalRef.current?.close();
            }}
          />
        </View>
      </CustomModal>
      <Text style={globalStyles.heading}>Join call with Session ID:</Text>
      <TextInput
        value={sessionID}
        onChangeText={setSessionID}
        style={globalStyles.textInput}
      />
      <Button
        title="Join"
        onPress={() => {
          navigation.navigate(APP_ROUTES.callScreen, {sessionID});
        }}
      />
      <CustomDivider />
      <ChatList />
    </View>
  );
};
