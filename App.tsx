/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {CometChat} from '@cometchat-pro/react-native-chat';

const Section: React.FC<
  PropsWithChildren<{
    title: string;
  }>
> = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

function makeid(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const App = () => {
  const [value, setValue] = useState('');
  const textInputRef = useRef<any>(null);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  var uid = makeid(14);
  var name = makeid(5);
  var user = new CometChat.User(uid);
  user.setName(name);

  useEffect(() => {
    (async () => {
      const created_user: any = await AsyncStorage.getItem('user');
      const loggedin_user: any = await AsyncStorage.getItem('login');

      if (!created_user) {
        const data = await CometChat.createUser(user, Config.AUTH_KEY ?? '');
        await AsyncStorage.setItem('user', JSON.stringify(data));
      }

      if (created_user && !loggedin_user) {
        const data = JSON.parse(created_user);
        CometChat.getLoggedinUser().then(
          user => {
            if (!user) {
              CometChat.login(data.uid, Config.AUTH_KEY).then(
                async (user: any) => {
                  await AsyncStorage.setItem('login', JSON.stringify(user));
                },
                error => {
                  console.log('Login failed with exception:', {error});
                },
              );
            }
          },
          error => {
            console.log('Some Error Occured', {error});
          },
        );
      }
    })();
  }, []);

  const onPress = () => {
    let receiverType = CometChat.RECEIVER_TYPE.USER;
    let textMessage = new CometChat.TextMessage(
      'ucb99gbgbadral',
      value,
      receiverType,
    );
    CometChat.sendMessage(textMessage).then(
      message => {
        console.log('Message sent successfully:');
      },
      error => {
        console.log('Message sending failed with error:', error);
      },
    );
  };

  useEffect(() => {
    const id = uid;
    CometChat.addMessageListener(
      id,
      new CometChat.MessageListener({
        onTextMessageReceived: (textMessage: any) => {
          Alert.alert('Alert Title', textMessage.text, [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ]);
        },
        onMediaMessageReceived: (mediaMessage: any) => {
          console.log('Media message received successfully', mediaMessage);
        },
        onCustomMessageReceived: (customMessage: any) => {},
      }),
    );
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{paddingHorizontal: 20, flex: 1}}>
        <TextInput
          style={styles.input}
          placeholder="Please Type your message"
          ref={textInputRef}
          onChangeText={text => setValue(text)}
        />
        <Button title="Send" onPress={onPress} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {height: 40, margin: 12, borderWidth: 1, padding: 10},
});

export default App;
