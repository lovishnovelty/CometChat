import {CometChat} from '@cometchat-pro/react-native-chat';
import React, {useEffect, useState} from 'react';
import {TextInput, KeyboardAvoidingView} from 'react-native';
import {ChatScreenAppBar, ChatScreenMessages} from '../components';
import {ChatScreenInput} from '../components';
import {IConversation} from '../interfaces';
import {chatService} from '../services';

export const ChatScreen = ({route}: any) => {
  const [messageList, setMessageList] = useState<CometChat.BaseMessage[]>([]);
  const conversation: IConversation = route.params;

  const getMessageList = async () => {
    chatService.getMessage(conversation.senderID).then(data => {
      setMessageList(data);
    });
  };

  useEffect(() => {
    getMessageList();
  }, []);

  return (
    <KeyboardAvoidingView style={{backgroundColor: 'white', flex: 1}}>
      <ChatScreenAppBar conversation={conversation} />
      <ChatScreenMessages messageList={messageList} />
      <ChatScreenInput />
    </KeyboardAvoidingView>
  );
};
