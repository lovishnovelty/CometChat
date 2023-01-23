import React, {useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import {APP_ROUTES} from '../constants';
import {SessionCall, Users} from '../screens';
import {IModalHandle} from '../interfaces';
import {useAppDispatch} from '../redux';
import {chatService} from '../services';
import {CallAlertModal, RecentChatList} from '../components';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const incomingCallModalRef = useRef<IModalHandle>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    chatService.listenForCall(incomingCallModalRef, dispatch);

    RNNotificationCall.addEventListener('answer', () => {
      incomingCallModalRef.current?.close();
    });

    RNNotificationCall.addEventListener('endCall', () => {
      incomingCallModalRef.current?.close();
    });

    return () => {
      RNNotificationCall.removeEventListener('answer');
      RNNotificationCall.removeEventListener('endCall');
    };
  }, []);

  return (
    <>
      <CallAlertModal ref={incomingCallModalRef} />

      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            let iconName = '';
            size = focused ? 25 : 22;
            if (route.name === APP_ROUTES.recentChat) {
              iconName = focused ? 'chat' : 'chat-outline';
            } else if (route.name === APP_ROUTES.users) {
              iconName = focused
                ? 'account-multiple'
                : 'account-multiple-outline';
            } else if (route.name === APP_ROUTES.sessionCall) {
              iconName = focused ? 'phone' : 'phone-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarStyle: {
            shadowColor: 'transparent',
            height: 50,
            paddingBottom: 0,
          },
          tabBarActiveTintColor: 'coral',
          tabBarShowLabel: false,
        })}>
        <Tab.Screen name={APP_ROUTES.recentChat} component={RecentChatList} />
        <Tab.Screen name={APP_ROUTES.users} component={Users} />
        <Tab.Screen name={APP_ROUTES.sessionCall} component={SessionCall} />
      </Tab.Navigator>
    </>
  );
};
