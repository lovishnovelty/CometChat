import React, {useRef, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {APP_ROUTES} from '../constants';
import {Home, SessionCall, Users} from '../screens';
import {IModalHandle} from '../interfaces';
import {useAppDispatch, useAppSelector} from '../redux';
import {chatService} from '../services';
import {CustomModal} from '../components/customModal';
import {globalStyles, homeStyles} from '../styles';
import {CustomAvatar, CustomDivider, RecentChatList} from '../components';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  const incomingCallModalRef = useRef<IModalHandle>(null);

  const {incomingCallInitiator, incomingCallID} = useAppSelector(
    state => state.call,
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    chatService.listenForCall(incomingCallModalRef, dispatch);
  }, []);

  return (
    <>
      {/* need to create separate com */}
      <CustomModal ref={incomingCallModalRef}>
        <Text style={globalStyles.heading}>Incoming call.</Text>
        <CustomDivider size="xs" />
        <View style={homeStyles.detailContainer}>
          <CustomAvatar url={incomingCallInitiator.avatar} size={50} />
          <CustomDivider value={5} axis="horizontal" />

          {/* <View> */}
          <Text style={globalStyles.title}>{incomingCallInitiator.name}</Text>
          <Text> is calling...</Text>
          {/* </View> */}
        </View>
        <CustomDivider value={10} />
        <View>
          <Button
            title="Accept"
            color={'green'}
            onPress={() => {
              incomingCallModalRef.current?.close();
              chatService.acceptIncomingCall(incomingCallID);
            }}
          />
          <CustomDivider size="xs" />
          <Button
            title="Reject"
            color={'red'}
            onPress={() => {
              chatService.rejectIncomingCall(incomingCallID);
              incomingCallModalRef.current?.close();
            }}
          />
        </View>
      </CustomModal>
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
