import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {ChatScreenAppBar, ChatScreenMessages} from '../components';
import {ChatScreenInput} from '../components';
import {IConversation} from '../interfaces';
import {IMessage} from '../interfaces/message';
import {useAppSelector} from '../redux';
import {chatService} from '../services';
import {ChatUtility} from '../utils';

export const ChatScreen = ({route}: any) => {
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const conversation: IConversation = route.params;
  const userID = useAppSelector(state => state.auth.userID);
  const listenerID = conversation.otherUserID;

  console.log(conversation.id, 'convo id');

  // used when chat screen is navigated from other place than recent chats as conversation is not available.
  const setConvoID = (id: string) => {
    if (conversation.id) return;
    conversation.id = id;
  };

  const getMessageList = async () => {
    chatService
      .getMessagesByUID(userID, conversation.otherUserID)
      .then(data => {
        setMessageList(data);
      });
  };

  const addMessageListener = () => {
    chatService.listenForMessage({
      listenerID,
      onTextMessageReceived: textMessage => {
        console.log(conversation.id, textMessage.getConversationId());

        if (conversation.id === textMessage.getConversationId()) {
          setMessageList(prev => [
            ...prev,
            ChatUtility.transformSingleMessage(textMessage, userID),
          ]);
        }
      },
    });
  };

  useEffect(() => {
    addMessageListener();
    getMessageList();

    return () => {
      chatService.removeMessageListener(listenerID);
    };
  }, []);

  return (
    <KeyboardAvoidingView style={{backgroundColor: 'white', flex: 1}}>
      <ChatScreenAppBar conversation={conversation} />
      <ChatScreenMessages messageList={messageList} />
      <ChatScreenInput
        setMessageList={setMessageList}
        setConvoID={setConvoID}
        receiverID={conversation.otherUserID}
      />
    </KeyboardAvoidingView>
  );
};
