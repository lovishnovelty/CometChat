import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {APP_ROUTES} from '../constants';
import {restoreAuthState, useAppDispatch, useAppSelector} from '../redux';
import {
  ChatScreen,
  CallScreen,
  OutgoingCallScreen,
  Login,
  SessionCall,
} from '../screens';
import {AuthService} from '../services';
import {navigation} from '../utils';
import {TabNavigator} from './tabNavigation';
import {DirectCallScreen} from '../screens/directCall';

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
      <SafeAreaView style={{flex: 1}}>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <RootStack.Screen name={APP_ROUTES.tab} component={TabNavigator} />
          <RootStack.Screen
            name={APP_ROUTES.directCall}
            component={DirectCallScreen}
          />
          <RootStack.Screen
            name={APP_ROUTES.chatScreen}
            component={ChatScreen}
          />
          <RootStack.Screen
            name={APP_ROUTES.callingScreen}
            component={OutgoingCallScreen}
          />
          <RootStack.Screen
            name={APP_ROUTES.sessionCall}
            component={SessionCall}
          />
        </RootStack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
};
