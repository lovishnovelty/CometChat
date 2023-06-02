import React, {useState, useRef} from 'react';
import {View, TextInput} from 'react-native';
import {chatScreenInputStyles as styles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMessage} from '../interfaces/message';
import {AuthService, chatService} from '../services';
import {useAppSelector} from '../redux';
import {CometChat} from '@cometchat-pro/react-native-chat';
import {ConvoType} from '../enums';

export const ChatScreenInput = ({
  setMessageList,
  receiverID,
  convoType,
}: {
  setMessageList: React.Dispatch<React.SetStateAction<IMessage[]>>;
  receiverID: string;
  convoType: ConvoType;
}) => {
  const [height, setHeight] = useState(40);
  const [text, setText] = useState('');
  const intervalID = useRef<number | null>(null);
  const userID = useAppSelector(state => state.auth.userID);

  const removeLocallyCreatedMessage = () => {
    setMessageList(prev => {
      return prev.filter(item => item.id !== 'newMessage');
    });
  };

  const appendMessage = (message: IMessage) => {
    setMessageList(prev => [...prev, message]);
  };

  const sendTextMessage = () => {
    if (text.trim() === '') return setText('');
    // add other field as well
    const newMessage: IMessage = {
      id: AuthService.createID(10),
      conversationID: '',
      text: text,
      isSentByMe: true,
      isTextMessage: true,
      isCallMessage: false,
      isMediaMessage: false,
      time: '',
      date: '',
      sender: {
        id: '',
        name: '',
        avatar: '',
      },
      receiver: {
        id: '',
        name: '',
        avatar: '',
      },
    };

    chatService
      .sendTextMessage({
        userID,
        receiverID,
        receiverType:
          convoType === ConvoType.GROUP
            ? CometChat.RECEIVER_TYPE.GROUP
            : CometChat.RECEIVER_TYPE.USER,
        message: text,
      })
      .then(message => {
        // removeLocallyCreatedMessage();
        // appendMessage(message);
      })
      .catch(() => {
        // removeLocallyCreatedMessage();
      });
    appendMessage(newMessage);
    setText('');
  };

  const startTyping = () => {
    if (intervalID.current) return;
    const interval = 5000;
    chatService.startTyping(receiverID);
    intervalID.current = setInterval(() => {
      endTyping();
    }, interval);
  };

  const endTyping = () => {
    chatService.endTyping(receiverID);
    if (intervalID.current) clearInterval(intervalID.current);
    intervalID.current = null;
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        placeholder="Type here..."
        autoFocus
        style={[
          styles.input,
          {
            height,
          },
        ]}
        multiline
        onContentSizeChange={({nativeEvent: {contentSize}}) =>
          setHeight(contentSize.height)
        }
        onChangeText={text => {
          startTyping();
          setText(text);
        }}
      />
      <Icon name="send" size={28} color={'coral'} onPress={sendTextMessage} />
    </View>
  );
};
