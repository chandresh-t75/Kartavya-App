import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View, Text, GestureResponderEvent, AccessibilityState, Animated } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol, IconSymbolName } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as Animatable from 'react-native-animatable';


interface CustomTabProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void; // Optional onPress for flexibility
  accessibilityState?: AccessibilityState; 
  color?:string             // Use React Native's AccessibilityState type
}
export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
        
        
   
       
        animation:"fade"
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          href: '/explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: 'Donate',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={"tomato"} />
          ),
          tabBarButton: (props) => (
            <CustomDonateTab {...props} onPress={props.onPress!} />
          ),
        }}
      />
      <Tabs.Screen
        name="contact/index"
        options={{
          title: 'Contact',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="phone.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"user.fill" as IconSymbolName} color={color} />,
        }}
      />
    </Tabs>
  );
}

export function CustomDonateTab({ children, onPress, accessibilityState, color }: CustomTabProps) {
  const focused = accessibilityState?.selected || false; // Handle undefined case
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate scale on focus
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: focused ? 1.1 : 1, // Scale to 1.2 when focused, back to 1 when unfocused
      duration: 300, // Animation duration
      useNativeDriver: true, // Enable native driver for better performance
    }).start();
  }, [focused]);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.donateButton,
          { transform: [{ scale: scaleAnim }] }, // Apply scaling effect
          focused && styles.donateButtonFocused, 
        ]}
      >
        <Animatable.View animation="pulse" iterationCount="infinite" iterationDelay={100}  direction="alternate" style={[styles.donateButtonInner]}>
          {children}
        </Animatable.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  donateButton: {
    position: 'absolute',
    top:-22,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 25, // Lift the button
    borderRadius: 50,
    width: 70,
    height: 70,
    backgroundColor: '#fff', // Background color
    borderWidth: 2,
    borderColor: '#81e8e3',
    
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
   
  },
  donateButtonFocused: {
    
    borderRadius: 50,
    width: 70,
    height: 70,
    backgroundColor: '#fff', // Background color
    borderWidth: 2,
    borderColor: '#31d1c9',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    
    
    // backgroundColor: 'darkred',
  },
  donateButtonInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
});
