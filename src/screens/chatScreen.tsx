import React, {useEffect, useState} from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {ChatScreenAppBar, ChatScreenMessages} from '../components';
import {ChatScreenInput} from '../components';
import {CallActionType} from '../enums';
import {IConversation} from '../interfaces';
import {IMessage} from '../interfaces/message';
import {useAppSelector} from '../redux';
import {ChatNotificaitonHandler, chatService} from '../services';
import {ChatUtility} from '../utils';

export const ChatScreen = ({route}: any) => {
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const conversation: IConversation = route.params;
  const authState = useAppSelector(state => state.auth);
  const listenerID = conversation.otherUserID;

  const getMessageList = async () => {
    chatService
      .getMessagesByUID(authState.userID, conversation.otherUserID)
      .then(data => {
        setMessageList(data);
      });
  };

  const addMessageListener = () => {
    chatService.listenForMessage({
      listenerID,
      onTextMessageReceived: textMessage => {
        const receiverType = textMessage.getReceiverType();
        if (receiverType === 'group') return;
        const senderID = textMessage.getSender().getUid();
        const receiverID = textMessage.getReceiverId();
        if (
          conversation.otherUserID === senderID ||
          conversation.otherUserID === receiverID
        ) {
          conversation.id = textMessage.getConversationId();
          setMessageList(prev => [
            ...prev,
            ChatUtility.transformSingleMessage(textMessage, authState.userID),
          ]);
        }
      },
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

  return (
    <KeyboardAvoidingView style={{backgroundColor: 'white', flex: 1}}>
      <ChatScreenAppBar conversation={conversation} />
      <ChatScreenMessages messageList={messageList} />
      <ChatScreenInput
        setMessageList={setMessageList}
        receiverID={conversation.otherUserID}
      />
    </KeyboardAvoidingView>
  );
};
