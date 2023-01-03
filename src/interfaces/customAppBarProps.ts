import {StyleProp, ViewStyle} from 'react-native';

export interface IAppBarProps {
  title: string | React.ReactNode;
  needBackArrow?: boolean;
  isTabs?: Boolean;
  actions?: [React.ReactNode?, React.ReactNode?];
  leading?: React.ReactNode;
  centerTitle?: boolean;
  paddingBottom?: number;
  style?: StyleProp<ViewStyle>;
}
