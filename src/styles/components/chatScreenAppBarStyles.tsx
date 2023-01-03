import {StyleSheet} from 'react-native';

export const chatScreenAppBarStyles = StyleSheet.create({
  container: {
    elevation: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  detailContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  name: {color: 'black', fontWeight: '500', flex: 1},
  icon: {
    marginLeft: 5,
  },
});
