import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {CustomDivider} from '../components';
import {APP_ROUTES} from '../constants';
import {globalStyles} from '../styles';
import {navigation} from '../utils';
import {joinSession, useAppDispatch} from '../redux';

const groupDetails: {
  groupName?: string;
  adminIds: string[];
  moderatorIds: string[];
  participantIds: string[];
  banMembers: string[];
} = {
  groupName: 'Test Group',
  adminIds: ['eoix3'],
  moderatorIds: [],
  participantIds: [],
  banMembers: [],
};

export const JoinSessionCall = () => {
  const [sessionID, setSessionID] = useState('');
  const dispatch = useAppDispatch();
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Join a call using session ID</Text>
      <CustomDivider />
      <Text style={globalStyles.heading}>Session ID</Text>
      <TextInput
        value={sessionID}
        onChangeText={setSessionID}
        style={globalStyles.textInput}
      />
      <Button
        title="Join"
        color={'coral'}
        onPress={() => {
          dispatch(joinSession(sessionID));
          navigation.navigate(APP_ROUTES.sessionCall, {
            groupDetails: {
              groupId: sessionID,
              ...groupDetails,
            },
          });
        }}
      />
      <CustomDivider />
    </View>
  );
};
