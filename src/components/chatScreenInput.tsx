import React, {useState} from 'react';
import {View, TextInput} from 'react-native';
import {chatScreenInputStyles as styles} from '../styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const ChatScreenInput = () => {
  const [height, setHeight] = useState(40);

  return (
    <View style={styles.container}>
      <TextInput
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
      />
      <Icon name="send" size={28} color={'coral'} />
    </View>
  );
};
