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
        uri:
          url ??
          'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg',
      }}
      style={{
        height: size,
        width: size,
        borderRadius: size / 2,
      }}
    />
  );
};
