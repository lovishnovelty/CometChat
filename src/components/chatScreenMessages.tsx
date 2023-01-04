import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {chatScreenMessagesStyles as styles} from '../styles';
import {TextMessage} from './textMessage';
import {CallMessage} from './callMessage';
import {MediaMessage} from './mediaMessage';
import {useAppSelector} from '../redux';

export const ChatScreenMessages = ({
  messageList,
}: {
  messageList: CometChat.BaseMessage[];
}) => {
  const userID = useAppSelector(state => state.auth.userID);

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={messageList}
      style={styles.list}
      renderItem={({item}) => {
        const isTextMessage = item instanceof CometChat.TextMessage;
        const isMediaMessage = item instanceof CometChat.MediaMessage;
        const isCallMessage = item.getCategory() === 'call';
        const isSentByMe = userID === item.getSender().getUid();
        const senderName = item.getSender().getName();
        const text = isTextMessage
          ? item.getText()
          : isMediaMessage
          ? 'Sent you a file'
          : 'Called you';

        return isTextMessage ? (
          <TextMessage message={text} isSentByMe={isSentByMe} />
        ) : isCallMessage ? (
          <CallMessage
            isInitiatedByMe={isSentByMe}
            isVideo={true}
            otherUserName={senderName}
          />
        ) : (
          <MediaMessage isSentByMe={isSentByMe} otherUserName={senderName} />
        );
      }}
    />
  );
};
