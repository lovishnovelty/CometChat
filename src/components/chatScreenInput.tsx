import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {chatScreenInputStyles as styles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMessage} from '../interfaces/message';
import {AuthService, chatService} from '../services';
import {useAppSelector} from '../redux';

export const ChatScreenInput = ({
  setMessageList,
  receiverID,
}: {
  setMessageList: React.Dispatch<React.SetStateAction<IMessage[]>>;
  receiverID: string;
}) => {
  const [height, setHeight] = useState(40);
  const [text, setText] = useState('');
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
    // add other field as well
    const newMessage: IMessage = {
      id: AuthService.createID(10),
      conversationID: '',
      text: text,
      initiatorName: '',
      isSentByMe: true,
      isTextMessage: true,
      isCallMessage: false,
      isMediaMessage: false,
      time: '',
      date: '',
      receiverName: '',
    };

    chatService
      .sendTextMessage({
        userID,
        receiverID,
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
        onChangeText={setText}
      />
      <Icon name="send" size={28} color={'coral'} onPress={sendTextMessage} />
    </View>
  );
};
