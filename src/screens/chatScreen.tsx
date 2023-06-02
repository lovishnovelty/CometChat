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
import {ConvoType} from '../enums';

export const ChatScreen = ({route}: any) => {
  const [gettingMessages, setGettingMessages] = useState(true);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const authState = useAppSelector(state => state.auth);
  const conversation: IConversation = route.params;

  const convoWithId = conversation.convoWith.id;
  const listenerID = convoWithId;

  const getMessageList = async () => {
    const messages =
      conversation.convoType === ConvoType.GROUP
        ? await chatService.getGroupMessagesByGID(authState.userID, convoWithId)
        : await chatService.getMessagesByUID(authState.userID, convoWithId);

    setMessageList(messages);
    setGettingMessages(false);
  };

  const onMessageReceived = (message: IMessage) => {
    let idToCheck;
    if (conversation.convoType === ConvoType.GROUP) {
      const group = message.receiver as any; // group object is received by getGuid() was undefined
      idToCheck = group.groupId;
    } else {
      idToCheck = message.sender.id;
    }
    if (convoWithId === idToCheck) {
      if (!conversation.id) conversation.id = message.conversationID;
      setMessageList(prev => [...prev, message]);
    }
  };

  const onTypingStarted = (typingIndicator: CometChat.TypingIndicator) => {
    const senderID = typingIndicator.getSender().getUid();
    if (convoWithId === senderID) {
      setIsTyping(true);
    }
  };

  const onTypingEnded = (typingIndicator: CometChat.TypingIndicator) => {
    const senderID = typingIndicator.getSender().getUid();
    if (convoWithId === senderID) {
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
      conversation.convoWith.name,
    );
    return () => {
      chatService.removeMessageListener(listenerID);
    };
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(setCurrentChatUserID(convoWithId));
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
        receiverID={convoWithId}
        convoType={conversation.convoType}
      />
    </KeyboardAvoidingView>
  );
};
