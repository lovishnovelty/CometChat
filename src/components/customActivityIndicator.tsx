import {ActivityIndicator, StyleProp, ViewStyle} from 'react-native';
import React from 'react';
const sizes: any = {
  large: 20,
  medium: 10,
  small: 5,
};
/**size:by default it will take medium(10) */

export const CustomActivityIndicator = ({
  size = sizes.medium,
  color = 'coral',
  style,
}: {
  size?: number | 'small' | 'large';
  color?: string;
  style?: StyleProp<ViewStyle>;
}) => <ActivityIndicator size={size} color={color} style={style} />;
