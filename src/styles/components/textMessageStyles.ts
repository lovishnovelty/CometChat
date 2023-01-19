import {StyleSheet} from 'react-native';
import {SizeConfig} from '../../config';

export const textMessageStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 18,
    marginBottom: 15,
    maxWidth: SizeConfig.screenWidth * 0.67,
  },
  sentMessage: {
    color: 'white',
  },
  reveivedMessage: {
    color: 'black',
  },
  sentContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'coral',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
});
