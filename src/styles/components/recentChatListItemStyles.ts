import {StyleSheet} from 'react-native';

export const recentChatListItemStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'lightgrey',
    paddingVertical: 15,
    marginBottom: 10,
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
