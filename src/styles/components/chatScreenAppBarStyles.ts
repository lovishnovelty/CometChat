import {StyleSheet} from 'react-native';

export const chatScreenAppBarStyles = StyleSheet.create({
  container: {
    elevation: 2,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
