import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const ButtonLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color="#fff" />
    </View>
  );
};

export default ButtonLoader;

const styles = StyleSheet.create({
  container: {
    width: 20,   // small loader size
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
