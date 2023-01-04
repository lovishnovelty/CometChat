import {StyleSheet} from 'react-native';

export const textMessageStyles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'coral',
    borderRadius: 18,
    marginBottom: 15,
  },
  message: {
    color: 'white',
  },
  sentContainer: {
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
  },
});
