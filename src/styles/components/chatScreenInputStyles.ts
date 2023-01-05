import {StyleSheet} from 'react-native';

export const chatScreenInputStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    // backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    maxHeight: 150,
    backgroundColor: 'lightgrey',
    paddingHorizontal: 15,
    marginRight: 10,
  },
});
