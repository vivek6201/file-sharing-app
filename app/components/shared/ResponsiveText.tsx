import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {
  fontSizeMap,
  PlatformType,
  ResponsiveTextType,
} from '../../types/responsiveText.types';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';

const ResponsiveText: FC<ResponsiveTextType> = props => {
  let computedFontSize =
    Platform.OS === PlatformType.ANDROID
      ? RFValue(props.fontSize || 12)
      : RFValue(props.fontSize || 10);

  if (props.variant && fontSizeMap[props.variant]) {
    const defaultFontSize =
      fontSizeMap[props.variant][Platform.OS as PlatformType];
    computedFontSize = RFValue(props.fontSize || defaultFontSize);
  }

  return (
    <Text
      onLayout={props.onLayout}
      style={[
        styles.text,
        {
          color: props.color || colors.text,
          fontSize: computedFontSize,
          ...props,
        },
      ]}
      numberOfLines={props.numberOfLines}>
      {props.children}
    </Text>
  );
};

export default ResponsiveText;

const styles = StyleSheet.create({
  text: {
    textAlign: 'left',
  },
});
