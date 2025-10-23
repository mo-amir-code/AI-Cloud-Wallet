import { colors } from "@/theme/colors";
import {
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.dark.secondary,
          borderTopWidth: 0,
          elevation: 0,
          height: 50,
          paddingBottom: 4,
        },
        tabBarActiveTintColor: colors.dark.accent,
        tabBarInactiveTintColor: colors.dark.text,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          tabBarLabel: "Send",
          tabBarIcon: ({ color }) => (
            <Ionicons name="send" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          tabBarLabel: "Contacts",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="contacts" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="face-man-profile"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
