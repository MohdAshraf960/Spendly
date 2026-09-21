import {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, View, StyleProp, ViewStyle} from 'react-native';
import {radius} from '../theme';
import {useTheme} from '../context';

// Lightweight loading bone. Width can be a number or a percent string.
export type ShimmerProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  baseColor?: string;
  highlightColor?: string;
  style?: StyleProp<ViewStyle>;
};

const Shimmer = ({
  width = '100%',
  height = 12,
  borderRadius = radius.sm,
  baseColor,
  highlightColor,
  style,
}: ShimmerProps) => {
  const {colors} = useTheme();
  const resolvedBase = baseColor ?? colors.surfaceSecondary;
  const resolvedHighlight = highlightColor ?? colors.white;

  const translateX = useRef(new Animated.Value(0)).current;
  const [boneWidth, setBoneWidth] = useState(0);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [translateX]);

  return (
    <View
      onLayout={event => setBoneWidth(event.nativeEvent.layout.width)}
      style={[
        styles.bone,
        {
          width,
          height,
          borderRadius,
          backgroundColor: resolvedBase,
        },
        style,
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.highlight,
          {
            backgroundColor: resolvedHighlight,
            transform: [
              {
                translateX: translateX.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-boneWidth, boneWidth],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bone: {
    overflow: 'hidden',
  },
  highlight: {
    ...StyleSheet.absoluteFill,
    width: '45%',
    opacity: 0.35,
  },
});

export default Shimmer;
