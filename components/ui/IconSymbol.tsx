// This file is a fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, TextStyle, ViewStyle } from 'react-native';
import Home from "../../assets/images/home.svg"
import Explore from "../../assets/images/explore.svg"
import Profile from "../../assets/images/profile.svg"
import Member from "../../assets/images/member.svg"



// Add your SFSymbol to MaterialIcons mappings here.
const MAPPING = {
  // MaterialIcons mappings for different tabs
  'house.fill': 'home', // Home icon
  'paperplane.fill': 'send', // Explore icon
  'heart.fill': 'favorite', // Donate icon
  'user.fill': 'person', // Profile icon
  'phone.fill': 'phone', // Contact icon
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>; // Change ViewStyle to TextStyle
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name];

  if (!iconName) {
    console.warn(`Icon name "${name}" is not mapped to MaterialIcons.`);
    return null;
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={iconName}
      style={style as StyleProp<TextStyle>} // Explicit type assertion to TextStyle
    />
  );
}

