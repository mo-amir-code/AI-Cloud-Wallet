// Loader.tsx
import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

const Loader = () => {
  const animations = useRef(
    [...Array(12)].map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animate = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
            delay,
          }),
          Animated.timing(value, {
            toValue: 0.25,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animations.forEach((anim, i) => animate(anim, i * 100));
  }, []);

  const bars = animations.map((opacity, i) => {
    const rotate = i * 30; // 12 bars, 360/12 = 30 degrees
    return (
      <Animated.View
        key={i}
        style={[
          styles.bar,
          {
            transform: [
              { rotate: `${rotate}deg` },
              { translateY: -27 }, // move out from center
            ],
            opacity,
          },
        ]}
      />
    );
  });

  return <View style={styles.loader}>{bars}</View>;
};

const styles = StyleSheet.create({
  loader: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  bar: {
    position: "absolute",
    width: 4,
    height: 14,
    backgroundColor: "gray",
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});



export default Loader;
