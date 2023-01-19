import {StyleSheet} from 'react-native';

export const mediaMessageStyles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    backgroundColor: 'lightgrey',
    borderRadius: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: 'grey',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  sentContainer: {
    alignSelf: 'flex-end',
  },
  receivedContainer: {
    alignSelf: 'flex-start',
  },
});
