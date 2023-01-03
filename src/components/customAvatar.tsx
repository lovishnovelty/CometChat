import React from 'react';
import {Image} from 'react-native';

export const CustomAvatar = ({
  url,
  size = 40,
}: {
  url: string;
  size?: number;
}) => {
  return (
    <Image
      source={{
        uri: url,
      }}
      style={{
        height: size,
        width: size,
        borderRadius: size / 2,
      }}
    />
  );
};
