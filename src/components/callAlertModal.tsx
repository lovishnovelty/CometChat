import {useImperativeHandle, forwardRef, useRef, useEffect} from 'react';
import {AppState, Text, TouchableOpacity, View} from 'react-native';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import Sound from 'react-native-sound';
import {SOUNDS} from '../constants';
import {IModalHandle} from '../interfaces';
import {useAppSelector} from '../redux';
import {chatService} from '../services';
import {callAlertModalStyles, globalStyles} from '../styles';
import {CustomAvatar} from './customAvatar';
import {CustomDivider} from './customDivider';
import {CustomModal} from './customModal';

export const CallAlertModal = forwardRef<IModalHandle>((_, ref) => {
  const {incomingCallInitiator, incomingCallID} = useAppSelector(
    state => state.call,
  );
  const ringtoneRef = useRef(
    new Sound(SOUNDS.ringtone, Sound.MAIN_BUNDLE, err => {
      if (err) {
        console.log('Failed to load ringtone', err);
      }
    }),
  );

  const modalRef = useRef<IModalHandle>(null);

  const open = () => {
    modalRef.current?.open();
    if (AppState.currentState === 'active') {
      ringtoneRef.current.play(success => {
        if (!success) {
          console.log('Failed to play ringtone.');
        }
      });
    }
  };

  const close = () => {
    ringtoneRef.current.stop();
    modalRef.current?.close();
  };

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  useEffect(() => {
    ringtoneRef.current.setNumberOfLoops(-1);
  }, []);

  return (
    <CustomModal ref={modalRef} isDismissible={false}>
      <Text style={globalStyles.heading}>Incoming call.</Text>
      <CustomDivider size="xs" />
      <View style={callAlertModalStyles.detailContainer}>
        <CustomAvatar url={incomingCallInitiator.avatar} size={50} />
        <CustomDivider value={5} axis="horizontal" />

        <Text style={globalStyles.title}>{incomingCallInitiator.name}</Text>
        <Text> is calling...</Text>
      </View>
      <CustomDivider value={10} />
      <View style={callAlertModalStyles.buttonsContainer}>
        <TouchableOpacity
          style={[
            callAlertModalStyles.button,
            callAlertModalStyles.declineButton,
          ]}
          onPress={() => {
            close();
            chatService.rejectIncomingCall(incomingCallID);
            RNNotificationCall.hideNotification();
          }}>
          <Text style={callAlertModalStyles.buttonLabel}>Decline</Text>
        </TouchableOpacity>
        <CustomDivider size="xs" />
        <TouchableOpacity
          style={[
            callAlertModalStyles.button,
            callAlertModalStyles.answerButton,
          ]}
          onPress={() => {
            close();
            chatService.acceptIncomingCall(incomingCallID);
            RNNotificationCall.hideNotification();
          }}>
          <Text style={callAlertModalStyles.buttonLabel}>Answer</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
});
