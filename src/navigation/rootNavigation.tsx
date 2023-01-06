import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {APP_ROUTES} from '../constants';
import {
  restoreAuthState,
  signIn,
  useAppDispatch,
  useAppSelector,
} from '../redux';
import {Home} from '../screens';
import {ChatScreen, CallScreen, CallingScreen} from '../screens';
import {AuthService, chatService} from '../services';
import {Login} from '../styles/screens/login';
import {navigation} from '../utils';
import {TabNavigator} from './tabNavigation';

export const RootNavigation = () => {
  const RootStack = createNativeStackNavigator();
  const [isLoggingIn, setIsLogginIn] = useState(true);
  const dispatch = useAppDispatch();

  const isLoggedIn = useAppSelector(state => state.auth.isSignedIn);

  useEffect(() => {
    AuthService.restoreAuthState().then(authState => {
      dispatch(restoreAuthState(authState));
      setIsLogginIn(false);
    });
  }, []);

  if (isLoggingIn) return <Text>Loggin in...</Text>;

  if (!isLoggedIn) return <Login />;

  return (
    <NavigationContainer ref={navigation.navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name={APP_ROUTES.tab} component={TabNavigator} />
        <RootStack.Screen name={APP_ROUTES.home} component={Home} />
        <RootStack.Screen name={APP_ROUTES.callScreen} component={CallScreen} />
        <RootStack.Screen name={APP_ROUTES.chatScreen} component={ChatScreen} />
        <RootStack.Screen
          name={APP_ROUTES.callingScreen}
          component={CallingScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
