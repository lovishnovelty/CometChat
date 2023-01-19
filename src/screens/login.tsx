import React, {useState} from 'react';
import {Text, TextInput, Button} from 'react-native';
import {CustomActivityIndicator, CustomDivider} from '../components';
import {useAppDispatch, signIn} from '../redux';
import {AuthService} from '../services';
import {globalStyles} from '../styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
    <KeyboardAwareScrollView
      style={globalStyles.container}
      keyboardShouldPersistTaps="handled">
      <Text style={globalStyles.heading}>Welcome to the chat module</Text>
      <CustomDivider />
      <Text style={globalStyles.title}>Enter you name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={globalStyles.textInput}
      />
      {isLogginIn ? (
        <CustomActivityIndicator size={24} style={{alignSelf: 'center'}} />
      ) : (
        <Button color={'coral'} title="Login" onPress={login} />
      )}
    </KeyboardAwareScrollView>
  );
};
