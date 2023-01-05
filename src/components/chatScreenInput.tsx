import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {chatScreenInputStyles as styles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IMessage} from '../interfaces/message';
import {chatService} from '../services';
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

  const sendTextMessage = () => {
    chatService
      .sendTextMessage({
        userID,
        receiverID,
        message: text,
      })
      .then(message => {
        setText('');
        setMessageList(prev => [...prev, message]);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
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
