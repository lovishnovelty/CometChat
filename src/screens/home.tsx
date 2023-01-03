import React, {useState} from 'react';
import {Text, View, TextInput, Button} from 'react-native';
import {ChatList, CustomCallComponent, CustomDivider} from '../components';
import {globalStyles} from '../styles';

export const Home = () => {
  const [sessionID, setSessionID] = useState('');
  const [isCalling, setIsCalling] = useState(false);

  return (
    <>
      {isCalling && (
        <CustomCallComponent
          sessionID={sessionID}
          onCallEnded={() => setIsCalling(false)}
        />
      )}
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
            setIsCalling(true);
          }}
        />
        <CustomDivider />
        <ChatList />
      </View>
    </>
  );
};
