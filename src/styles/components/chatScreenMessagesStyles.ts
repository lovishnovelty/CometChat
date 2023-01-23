import {StyleSheet} from 'react-native';
import {SPACING} from '../../constants';

export const chatScreenMessagesStyles = StyleSheet.create({
  list: {
    padding: 10,
    paddingBottom: 0,
  },
  typingContainer: {
    paddingLeft: SPACING.padding.lg,
    paddingRight: SPACING.padding.sm,
    borderRadius: 25,
    marginBottom: 15,
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEEE',
  },
});
