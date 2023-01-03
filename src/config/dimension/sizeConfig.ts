import {Dimensions, StatusBar, Platform} from 'react-native';

export const SizeConfig = {
  screenHeight: Dimensions.get('window').height,
  screenWidth: Dimensions.get('window').width,
  statusBarHeight:
    Platform.OS === 'ios'
      ? 20
      : StatusBar.currentHeight
      ? StatusBar.currentHeight
      : 21,
};
