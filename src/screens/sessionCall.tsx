import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {CustomActivityIndicator, CustomAppBar} from '../components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {chatService} from '../services';
import {globalStyles} from '../styles';
import {CallScreen} from './callScreen';
import {navigation} from '../utils';

export const SessionCall = ({route}: any) => {
  const {groupDetails} = route.params;
  const [isCreatingGroup, setIsCreatingGroup] = useState(true);

  const getSettings = () => {
    return chatService.joinCall({
      sessionID: groupDetails.groupId ?? 'abc',
      onCallEnded: navigation.pop,
    });
  };

  const createGroup = async () => {
    await chatService.createGroup(groupDetails).catch(err => {
      console.log({err});
    });
    setIsCreatingGroup(false);
  };

  useEffect(() => {
    createGroup();
  }, []);

  return (
    <View style={globalStyles.flex1}>
      <CustomAppBar
        title="Virtual Visit"
        centerTitle={false}
        actions={[
          <Icon
            name={'forum-outline'}
            onPress={() => {}}
            size={24}
            color="black"
          />,
        ]}
      />
      <View style={globalStyles.containerWithoutPadding}>
        {isCreatingGroup ? (
          <CustomActivityIndicator size={'large'} />
        ) : (
          <CallScreen callSettings={getSettings()} />
        )}
      </View>
    </View>
  );
};
