import React from 'react';
import {
  Text as NativeText,
  StyleSheet,
  Platform,
  TextProps as TextProperties,
  TextStyle,
  StyleProp,
} from 'react-native';
import { fonts } from '../config';
import { patchWebProps, RneFunctionComponent } from '../helpers';
import normalize from '../helpers/normalizeText';

export type TextProps = TextProperties & {
  style?: StyleProp<TextStyle>;
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h1Style?: StyleProp<TextStyle>;
  h2Style?: StyleProp<TextStyle>;
  h3Style?: StyleProp<TextStyle>;
  h4Style?: StyleProp<TextStyle>;
};

export const Text: RneFunctionComponent<TextProps> = ({
  style = {},
  h1 = false,
  h2 = false,
  h3 = false,
  h4 = false,
  h1Style = {},
  h2Style = {},
  h3Style = {},
  h4Style = {},
  children = '',
  theme,
  ...rest
}) => {
  return (
    <NativeText
      style={StyleSheet.flatten([
        {
          ...Platform.select({
            android: {
              ...(fonts.android.regular as TextStyle),
            },
          }),
          color: theme?.colors?.black,
        },
        style,
        (h1 || h2 || h3 || h4) && (styles.bold as TextStyle),
        h1 && StyleSheet.flatten([{ fontSize: normalize(40) }, h1Style]),
        h2 && StyleSheet.flatten([{ fontSize: normalize(34) }, h2Style]),
        h3 && StyleSheet.flatten([{ fontSize: normalize(28) }, h3Style]),
        h4 && StyleSheet.flatten([{ fontSize: normalize(22) }, h4Style]),
      ])}
      {...patchWebProps(rest)}
    >
      {children}
    </NativeText>
  );
};

const styles = StyleSheet.create({
  bold: {
    ...Platform.select({
      android: {
        ...(fonts.android.bold as TextStyle),
      },
    }),
  },
});

Text.displayName = 'Text';
