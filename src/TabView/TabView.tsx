import React from 'react';
import {
  Animated,
  PanResponder,
  View,
  StyleSheet,
  PanResponderGestureState,
  GestureResponderEvent,
} from 'react-native';
import { RneFunctionComponent, ScreenWidth } from '../helpers';

// TabView
export type TabViewBaseProps = {
  value?: number;
  onChange?: (value: number) => any;
  animationType?: 'spring' | 'timing';
  animationConfig?: Omit<
    Animated.SpringAnimationConfig & Animated.TimingAnimationConfig,
    'toValue'
  >;
};

export const TabViewBase: RneFunctionComponent<TabViewBaseProps> = ({
  children,
  onChange,
  value = 0,
  animationType = 'spring',
  animationConfig = {},
}) => {
  const { current: translateX } = React.useRef(new Animated.Value(0));
  const currentIndex = React.useRef(value);
  const length = React.Children.count(children);

  const onPanResponderRelease = (
    _: GestureResponderEvent,
    { dx, dy }: PanResponderGestureState
  ) => {
    if (
      (dx > 0 && currentIndex.current <= 0) ||
      (dx < 0 && currentIndex.current >= length - 1)
    ) {
      return;
    }
    if (Math.abs(dy) > Math.abs(dx)) {
      return;
    }
    const position = dx / -ScreenWidth;
    const next = position > value ? Math.ceil(position) : Math.floor(position);
    onChange?.(currentIndex.current + next);
  };

  const { current: panResponder } = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => true,
      onPanResponderRelease,
    })
  );

  const animate = React.useCallback(() => {
    Animated[animationType](translateX, {
      toValue: value,
      useNativeDriver: true,
      ...animationConfig,
    }).start();
  }, [translateX, value, animationType, animationConfig]);

  React.useEffect(() => {
    animate();
    currentIndex.current = value;
  }, [animate, value]);

  return (
    <Animated.View
      testID="tabView-test"
      style={[
        styles.container,
        {
          width: ScreenWidth * length,
          transform: [
            {
              translateX: translateX.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -ScreenWidth],
              }),
            },
          ],
        },
      ]}
      {...panResponder.panHandlers}
    >
      {React.Children.map(children, (child) => (
        <View style={styles.container}>{child}</View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    width: ScreenWidth,
  },
});

TabViewBase.displayName = 'TabViewBase';
