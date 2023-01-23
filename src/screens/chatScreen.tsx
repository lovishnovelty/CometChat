import {CometChat} from '@cometchat-pro/react-native-chat';
import {useIsFocused} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {
  ChatScreenAppBar,
  ChatScreenMessages,
  CustomActivityIndicator,
} from '../components';
import {ChatScreenInput} from '../components';
import {IConversation} from '../interfaces';
import {IMessage} from '../interfaces/message';
import {setCurrentChatUserID, useAppDispatch, useAppSelector} from '../redux';
import {ChatNotificaitonHandler, chatService} from '../services';

export const ChatScreen = ({route}: any) => {
  const [gettingMessages, setGettingMessages] = useState(true);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const authState = useAppSelector(state => state.auth);
  const conversation: IConversation = route.params;
  const listenerID = conversation.otherUserID;

  const getMessageList = async () => {
    chatService
      .getMessagesByUID(authState.userID, conversation.otherUserID)
      .then(data => {
        setMessageList(data);
        setGettingMessages(false);
      });
  };

  const onMessageReceived = (message: IMessage) => {
    const senderID = message.sender.id;
    if (conversation.otherUserID === senderID) {
      if (!conversation.id) conversation.id = message.conversationID;
      setMessageList(prev => [...prev, message]);
    }
  };

  const onTypingStarted = (typingIndicator: CometChat.TypingIndicator) => {
    const senderID = typingIndicator.getSender().getUid();
    if (conversation.otherUserID === senderID) {
      setIsTyping(true);
    }
  };

  const onTypingEnded = (typingIndicator: CometChat.TypingIndicator) => {
    const senderID = typingIndicator.getSender().getUid();
    if (conversation.otherUserID === senderID) {
      setIsTyping(false);
    }
  };

  const addMessageListener = () => {
    chatService.listenForMessage({
      listenerID,
      onMessageReceived,
      onTypingStarted,
      onTypingEnded,
    });
  };

  useEffect(() => {
    addMessageListener();
    getMessageList();
    ChatNotificaitonHandler.removeNotificationsByUserName(
      conversation.otherUserName,
    );
    return () => {
      chatService.removeMessageListener(listenerID);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(setCurrentChatUserID(conversation.otherUserID));
    }
  }, [isFocused]);

  return (
    <KeyboardAvoidingView style={{backgroundColor: 'white', flex: 1}}>
      <ChatScreenAppBar conversation={conversation} />
      {gettingMessages ? (
        <CustomActivityIndicator size={'large'} style={{flex: 1}} />
      ) : (
        <ChatScreenMessages messageList={messageList} isTyping={isTyping} />
      )}
      <ChatScreenInput
        setMessageList={setMessageList}
        receiverID={conversation.otherUserID}
      />
    </KeyboardAvoidingView>
  );
};
