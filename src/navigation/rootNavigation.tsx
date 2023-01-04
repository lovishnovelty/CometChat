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
import {signIn, useAppDispatch} from '../redux';
import {Home} from '../screens';
import {ChatScreen, CallScreen, CallingScreen} from '../screens';
import {chatService} from '../services';
import {navigation} from '../utils';

export const RootNavigation = () => {
  const RootStack = createNativeStackNavigator();
  const [isLoggingIn, setIsLogginIn] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    chatService.login().then(user => {
      setIsLogginIn(false);
      dispatch(signIn(user.getUid()));
    });
  }, []);

  if (isLoggingIn) return <Text>Loggin in...</Text>;

  return (
    <NavigationContainer ref={navigation.navigationRef}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
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
