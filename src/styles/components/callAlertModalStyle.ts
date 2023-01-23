import {StyleSheet} from 'react-native';
import {SPACING} from '../../constants';

export const callAlertModalStyles = StyleSheet.create({
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  button: {
    paddingVertical: SPACING.padding.md,
    paddingHorizontal: SPACING.padding.xxl,
    borderRadius: 20,
  },
  buttonLabel: {
    color: 'white',
  },
  answerButton: {
    backgroundColor: 'green',
  },
  declineButton: {
    backgroundColor: 'red',
  },
});
