import React from 'react';
import {
  View,
  Animated,
  StyleProp,
  ViewStyle,
  ViewProps,
  StyleSheet,
} from 'react-native';
import { RneFunctionComponent } from '../helpers';
import { TabItemProps } from './TabItem';

export type TabBaseProps = ViewProps & {
  value?: number;
  onChange?: (value: number) => void;
  disableIndicator?: boolean;
  indicatorStyle?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'default';
};

export const TabBase: RneFunctionComponent<TabBaseProps> = ({
  theme,
  children,
  value,
  onChange = () => {},
  indicatorStyle,
  disableIndicator,
  variant,
  ...props
}) => {
  const [dim, setDim] = React.useState({ width: 0 });
  const { current: animation } = React.useRef(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: value as number,
      useNativeDriver: true,
      duration: 170,
    }).start();
  }, [animation, value]);

  const WIDTH = dim.width / React.Children.count(children);

  return (
    <>
      <View
        {...props}
        accessibilityRole="tablist"
        style={[
          styles.viewStyle,
          variant === 'primary' && {
            backgroundColor: theme?.colors?.primary,
          },
        ]}
        onLayout={({ nativeEvent: { layout } }) => setDim(Object(layout))}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child as React.ReactElement<TabItemProps>, {
            onPress: () => onChange(index),
            active: index === value,
            variant,
          });
        })}
        {!disableIndicator && (
          <Animated.View
            style={[
              styles.indicator,
              {
                backgroundColor: theme?.colors?.secondary,
                transform: [
                  {
                    translateX: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, WIDTH],
                    }),
                  },
                ],
              },
              indicatorStyle,
            ]}
          >
            <View style={{ width: WIDTH }} />
          </Animated.View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  titleStyle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  containerStyle: {
    flex: 1,
    borderRadius: 0,
  },
  viewStyle: {
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: {
    display: 'flex',
    position: 'absolute',
    height: 2,
    bottom: 0,
  },
});

TabBase.displayName = 'TabBase';
