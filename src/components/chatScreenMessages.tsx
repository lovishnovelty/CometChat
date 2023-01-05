import React, {useRef} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {chatScreenMessagesStyles as styles} from '../styles';
import {TextMessage} from './textMessage';
import {CallMessage} from './callMessage';
import {MediaMessage} from './mediaMessage';
import {useAppSelector} from '../redux';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';

export const ChatScreenMessages = ({
  messageList,
}: {
  messageList: CometChat.BaseMessage[];
}) => {
  const userID = useAppSelector(state => state.auth.userID);
  const listRef = useRef<KeyboardAwareFlatList>(null);
  return (
    <KeyboardAwareFlatList
      ref={listRef}
      onContentSizeChange={() => {
        listRef.current?.scrollToEnd();
      }}
      showsVerticalScrollIndicator={false}
      data={messageList}
      contentContainerStyle={styles.list}
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
