import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import {ChatList, Home} from '../screens';

export const RootNavigation = () => {
  const RootStack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name={APP_ROUTES.home} component={CometChatUI} />
        <RootStack.Screen name={APP_ROUTES.chatList} component={ChatList} />
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
