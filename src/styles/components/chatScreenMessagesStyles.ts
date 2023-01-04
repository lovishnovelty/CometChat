import {StyleSheet} from 'react-native';
import {SizeConfig} from '../../config';

export const chatScreenMessagesStyles = StyleSheet.create({
  list: {
    padding: 10,
  },
  messageContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'coral',
    borderRadius: 18,
    marginBottom: 15,
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  callMessageContainer: {
    alignSelf: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    marginBottom: 10,
  },
  mediaMessageContainer: {
    alignSelf: 'center',
  },
});
