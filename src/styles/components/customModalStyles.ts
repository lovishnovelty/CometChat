import {StyleSheet} from 'react-native';
import {SizeConfig} from '../../config';
import {SPACING} from '../../constants';

export const customModalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  alertContainer: {
    backgroundColor: 'white',
    width: SizeConfig.screenWidth - 2 * SPACING.margin.xl,
    borderRadius: 12,
  },
});
