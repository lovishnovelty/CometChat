import React, {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {RootNavigation} from './src/navigation/rootNavigation';
import {chatService} from './src/services';

const App = () => {
  const [isLoggingIn, setIsLogginIn] = useState(true);

  useEffect(() => {
    chatService.login().then(() => {
      setIsLogginIn(false);
    });
  }, []);

  if (isLoggingIn) return <Text>Loggin in...</Text>;

  return <RootNavigation />;
};

export default App;
