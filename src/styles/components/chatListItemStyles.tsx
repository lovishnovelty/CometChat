import {StyleSheet} from 'react-native';

export const chatListItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    paddingVertical: 15,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
});
