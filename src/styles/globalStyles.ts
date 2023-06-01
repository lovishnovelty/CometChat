import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  flex1: {flex: 1},
  container: {
    padding: 20,
    backgroundColor: 'white',
    flex: 1,
  },
  containerWithoutPadding: {
    backgroundColor: 'white',
    flex: 1,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    color: 'black',
  },
  textInput: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  placeholder: {
    marginTop: 100,
    alignSelf: 'center',
  },
});
