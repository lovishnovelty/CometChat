import React, {useState} from 'react';
import {Text, View, TextInput, Button} from 'react-native';
import {ChatList, CustomDivider} from '../components';
import {APP_ROUTES} from '../constants';
import {globalStyles} from '../styles';
import {navigation} from '../utils';

export const Home = () => {
  const [sessionID, setSessionID] = useState('');

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Join call with Session ID:</Text>
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
