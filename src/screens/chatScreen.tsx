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
import {ChatUtility} from '../utils';

export const ChatScreen = ({route}: any) => {
  const [gettingMessages, setGettingMessages] = useState(true);
  const dispatch = useAppDispatch();
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const conversation: IConversation = route.params;
  const authState = useAppSelector(state => state.auth);
  const listenerID = conversation.otherUserID;
  const isFocused = useIsFocused();
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

  const addMessageListener = () => {
    chatService.listenForMessage({
      listenerID,
      onMessageReceived,
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
        <ChatScreenMessages messageList={messageList} />
      )}
      <ChatScreenInput
        setMessageList={setMessageList}
        receiverID={conversation.otherUserID}
      />
    </KeyboardAvoidingView>
  );
};
