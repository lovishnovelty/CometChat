import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {
  CometChatConversationList,
  CometChatConversationListWithMessages,
  CometChatGroupList,
  CometChatGroupListWithMessages,
  CometChatMessages,
  CometChatUI,
  CometChatUserList,
  CometChatUserListWithMessages,
} from '../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src';
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
        <RootStack.Screen
          name={APP_ROUTES.cometChatUi}
          component={CometChatUI}
        />
        <RootStack.Screen
          name="Conversation"
          component={CometChatConversationListWithMessages}
        />
        <RootStack.Screen
          name="ConversationComponent"
          component={CometChatConversationList}
        />
        <RootStack.Screen
          name="Group"
          component={CometChatGroupListWithMessages}
        />
        <RootStack.Screen
          name="GroupComponent"
          component={CometChatGroupList}
        />
        <RootStack.Screen
          name="Users"
          component={CometChatUserListWithMessages}
        />
        <RootStack.Screen name="UsersComponent" component={CometChatUserList} />
        <RootStack.Screen
          name="CometChatMessages"
          component={CometChatMessages}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
