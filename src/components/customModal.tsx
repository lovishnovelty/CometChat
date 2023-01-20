import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {View, Modal, TouchableWithoutFeedback} from 'react-native';
import {SPACING} from '../constants';
import {IModalHandle} from '../interfaces';
import {customModalStyles} from '../styles/components/customModalStyles';

export const CustomModal = forwardRef<
  IModalHandle,
  {
    children: React.ReactNode;
    needPadding?: boolean;
    isDismissible?: boolean;
  }
>(({children, needPadding = true, isDismissible = true}, ref) => {
  const [visible, setModalVisible] = useState(false);

  const close = () => setModalVisible(false);

  const dismiss = () => {
    if (isDismissible) {
      close();
    }
  };

  useImperativeHandle(ref, () => ({
    open: () => setModalVisible(true),
    close,
  }));

  return (
    <Modal
      statusBarTranslucent
      transparent
      visible={visible}
      onRequestClose={dismiss}
      animationType="fade">
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={customModalStyles.container}>
          <TouchableWithoutFeedback>
            <View
              style={[
                {
                  padding: needPadding ? SPACING.padding.lg : 0,
                },
                customModalStyles.alertContainer,
              ]}>
              {children}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
});
