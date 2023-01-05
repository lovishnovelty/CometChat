import React, {useRef} from 'react';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {chatScreenMessagesStyles as styles} from '../styles';
import {TextMessage} from './textMessage';
import {CallMessage} from './callMessage';
import {MediaMessage} from './mediaMessage';
import {useAppSelector} from '../redux';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {IMessage} from '../interfaces/message';

export const ChatScreenMessages = ({
  messageList,
}: {
  messageList: IMessage[];
}) => {
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
      renderItem={({
        item: {isTextMessage, isSentByMe, text, isCallMessage},
      }: {
        item: IMessage;
      }) => {
        return isTextMessage ? (
          <TextMessage message={text} isSentByMe={isSentByMe} />
        ) : isCallMessage ? (
          <CallMessage message={text} />
        ) : (
          <MediaMessage isSentByMe={isSentByMe} message={text} />
        );
      }}
    />
  );
};
