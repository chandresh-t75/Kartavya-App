import { useEffect } from "react";
import { Animated } from "react-native";


const SkeletonLoader = ({ width, height, borderRadius }: any) => {
  const opacity = new Animated.Value(0.3);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#e0e0e0',
        marginBottom: 10,
        opacity,
      }}
    />
  );
};

export default SkeletonLoader;