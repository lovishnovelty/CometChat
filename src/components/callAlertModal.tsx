import {useImperativeHandle, forwardRef, useRef} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
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

  const modalRef = useRef<IModalHandle>(null);

  useImperativeHandle(ref, () => ({
    open: () => modalRef.current?.open(),
    close: () => modalRef.current?.close(),
  }));

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
            modalRef.current?.close();
            chatService.rejectIncomingCall(incomingCallID);
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
            modalRef.current?.close();
            chatService.acceptIncomingCall(incomingCallID);
          }}>
          <Text style={callAlertModalStyles.buttonLabel}>Answer</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
});
