import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {CustomDivider} from '../components';
import {APP_ROUTES} from '../constants';
import {globalStyles} from '../styles';
import {navigation} from '../utils';

export const SessionCall = () => {
  const [sessionID, setSessionID] = useState('');
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
          navigation.navigate(APP_ROUTES.callScreen, {sessionID});
        }}
      />
      <CustomDivider />
    </View>
  );
};
