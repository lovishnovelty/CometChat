import React, {useState} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import {CustomCallComponent} from '../components';

export const Home = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [sessionID, setSessionID] = useState('');
  return (
    <>
      {isCalling && (
        <CustomCallComponent
          sessionID={sessionID}
          onCallEnded={() => setIsCalling(false)}
        />
      )}
      <View style={{padding: 20}}>
        <Text style={{color: 'black'}}>Session ID: </Text>
        <TextInput
          style={{borderBottomWidth: 1, marginVertical: 20, color: 'black'}}
          onChangeText={text => setSessionID(text)}
        />
        <Button
          title="Join Call"
          onPress={() => {
            setIsCalling(true);
          }}
        />
      </View>
    </>
  );
};
