import React, {useState} from 'react';
import {View, Text, TextInput, Button, ActivityIndicator} from 'react-native';
import {CustomDivider} from '../../components';
import {useAppDispatch, signIn} from '../../redux';
import {AuthService} from '../../services';
import {globalStyles} from '../globalStyles';

export const Login = () => {
  const [name, setName] = useState('');
  const [isLogginIn, setIsLogginIn] = useState(false);
  const dispatch = useAppDispatch();

  const login = () => {
    setIsLogginIn(true);
    AuthService.login(name).then(user => {
      dispatch(
        signIn({
          name: user.getName(),
          id: user.getUid(),
        }),
      );
      setIsLogginIn(false);
    });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.heading}>Welcome to the chat module</Text>
      <CustomDivider />
      <Text style={globalStyles.title}>Enter you name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={globalStyles.textInput}
      />
      {isLogginIn ? (
        <ActivityIndicator style={{alignSelf: 'center'}} />
      ) : (
        <Button title="Login" onPress={login} />
      )}
    </View>
  );
};
