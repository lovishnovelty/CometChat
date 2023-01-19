import React, {useEffect, useRef} from 'react';
import {Text, View, Button} from 'react-native';
import {RecentChatList, CustomAvatar, CustomDivider} from '../components';
import {CustomModal} from '../components/customModal';
import {IModalHandle} from '../interfaces';
import {useAppDispatch, useAppSelector} from '../redux';
import {chatService} from '../services';
import {globalStyles, homeStyles} from '../styles';
export const Home = () => {
  return <View style={globalStyles.container}>{/* <RecentChatList /> */}</View>;
};
