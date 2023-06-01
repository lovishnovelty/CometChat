import React, {useRef} from 'react';
import LottieView from 'lottie-react-native';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import normalize from 'react-native-normalize';
import {chatScreenMessagesStyles as styles} from '../styles';
import {TextMessage} from './textMessage';
import {CallMessage} from './callMessage';
import {MediaMessage} from './mediaMessage';
import {IMessage} from '../interfaces/';
import {CallActionType} from '../enums';
import {View} from 'react-native';

export const ChatScreenMessages = ({
  messageList,
  isTyping = false,
}: {
  messageList: IMessage[];
  isTyping?: boolean;
}) => {
  const listRef = useRef<KeyboardAwareFlatList>(null);

  const scrollToEnd = () => {
    listRef.current?.scrollToEnd();
  };

  const buildTypingComponent = () => {
    return isTyping ? (
      <View style={styles.typingContainer}>
        <LottieView
          source={require('../../assets/lottie/typing.json')}
          autoPlay
          loop
          style={{height: normalize(25)}}
        />
      </View>
    ) : (
      <></>
    );
  };

  return (
    <KeyboardAwareFlatList
      ref={listRef}
      onContentSizeChange={scrollToEnd}
      onLayout={scrollToEnd}
      showsVerticalScrollIndicator={false}
      data={messageList.filter((message, i) => {
        return message.callDetails
          ? message.callDetails.callActionType !== CallActionType.ONGOING
          : true;
      })}
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
      ListFooterComponent={buildTypingComponent}
    />
  );
};
