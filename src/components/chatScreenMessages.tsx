import React, {useRef} from 'react';
import {chatScreenMessagesStyles as styles} from '../styles';
import {TextMessage} from './textMessage';
import {CallMessage} from './callMessage';
import {MediaMessage} from './mediaMessage';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {IMessage} from '../interfaces/';
import {CallActionType} from '../enums';

export const ChatScreenMessages = ({
  messageList,
}: {
  messageList: IMessage[];
}) => {
  const listRef = useRef<KeyboardAwareFlatList>(null);

  const scrollToEnd = () => {
    listRef.current?.scrollToEnd();
  };

  return (
    <KeyboardAwareFlatList
      ref={listRef}
      onContentSizeChange={scrollToEnd}
      onLayout={scrollToEnd}
      showsVerticalScrollIndicator={false}
      data={messageList.filter(message =>
        message.callDetails
          ? message.callDetails.callActionType !== CallActionType.ONGOING
          : true,
      )}
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
