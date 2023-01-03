import React from 'react';
import {StyleProp, TextStyle, View} from 'react-native';

const sizes: any = {
  large: 20,
  medium: 15,
  small: 10,
  xs: 5,
};

const CustomDivider = ({
  value,
  size,
  axis = 'vertical',
  style,
}: {
  value?: number;

  size?: string;
  axis?: 'horizontal' | 'vertical';
  style?: StyleProp<TextStyle>;
}) => {
  return (
    <View
      style={[
        style,
        axis === 'horizontal'
          ? {
              marginHorizontal: value
                ? value
                : size
                ? sizes[size]
                : sizes['medium'],
            }
          : {
              marginVertical: value
                ? value
                : size
                ? sizes[size]
                : sizes['medium'],
            },
      ]}
    />
  );
};

export {CustomDivider};
