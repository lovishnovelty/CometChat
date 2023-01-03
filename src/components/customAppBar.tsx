import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {IAppBarProps} from '../interfaces';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {customAppBarStyles} from '../styles';

export const CustomAppBar = ({
  title,
  needBackArrow = true,
  actions = [],
  leading,
  centerTitle = true,
  style,
}: IAppBarProps) => {
  const navigation = useNavigation();

  const stylesFromProps = StyleSheet.create({
    titleContainer: {
      justifyContent: centerTitle ? 'center' : 'flex-start',
    },
  });

  const showBackArrow = navigation.canGoBack() && needBackArrow;

  return (
    <View>
      <View style={[customAppBarStyles.appbarContainer, style]}>
        <View style={customAppBarStyles.leading}>
          {leading
            ? leading
            : showBackArrow && (
                <Icon
                  name={'chevron-left'}
                  onPress={navigation.goBack}
                  size={24}
                />
              )}
        </View>
        <View
          style={[
            customAppBarStyles.titleContainer,
            stylesFromProps.titleContainer,
          ]}>
          {typeof title === 'string' ? (
            <Text
              style={[{textAlignVertical: 'center', alignSelf: 'center'}]}
              numberOfLines={1}>
              {title}
            </Text>
          ) : (
            title
          )}
        </View>
        <View style={customAppBarStyles.actionsContainer}>
          {actions.map((action, index) => (
            <View key={index} style={customAppBarStyles.action}>
              {action}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
