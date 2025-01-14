import React from 'react';
import { StyleSheet } from 'react-native';
import { RneFunctionComponent } from '../helpers';
import Input, { InputProps } from '../Input';

export type ListItemInputProps = InputProps;

export const ListItemInput: RneFunctionComponent<ListItemInputProps> = ({
  inputStyle,
  inputContainerStyle,
  containerStyle,
  ...props
}) => {
  return (
    <Input
      renderErrorMessage={false}
      {...props}
      inputStyle={StyleSheet.flatten([styles.input, inputStyle])}
      inputContainerStyle={StyleSheet.flatten([
        styles.inputContainer,
        inputContainerStyle,
      ])}
      containerStyle={StyleSheet.flatten([styles.container, containerStyle])}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 0,
  },
  inputContainer: {
    flex: 1,
    borderBottomWidth: 0,
    width: null,
    height: null,
  },
  input: {
    flex: 1,
    textAlign: 'right',
    width: null,
    height: null,
  },
});

ListItemInput.displayName = 'ListItemInput';
