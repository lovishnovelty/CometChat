import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_ROUTES} from '../constants';
import {CallScreen, ChatList, Home} from '../screens';

export const RootNavigation = () => {
  const RootStack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <RootStack.Screen name={APP_ROUTES.home} component={Home} />
        <RootStack.Screen name={APP_ROUTES.chatList} component={ChatList} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
