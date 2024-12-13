import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Modal from 'react-native-modal'; // Import the modal
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function TabTwoScreen() {
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  

  const toggleDrawer = () => {
     setDrawerVisible(!isDrawerVisible);
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Explore</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>

      {/* TouchableOpacity to open the bottom drawer */}
      <TouchableOpacity onPress={toggleDrawer}>
        <ThemedView style={styles.infoButton}>
          
          <ThemedText>About this app</ThemedText>
        </ThemedView>
      </TouchableOpacity>

      {/* Bottom Drawer Modal */}
      <Modal
        isVisible={isDrawerVisible}
        onBackdropPress={toggleDrawer} 
        onBackButtonPress={toggleDrawer} 
        style={styles.modal}
        swipeDirection="down" 
        onSwipeComplete={toggleDrawer}
        backdropOpacity={0.3} 
      >
        <Animated.View
          style={[styles.modalContent]}>
          <ThemedText>About this app:</ThemedText>
          <ThemedText>This is an example application to help you get started.</ThemedText>
          <ThemedText>About this app:</ThemedText>
          <ThemedText>This is an example application to help you get started.</ThemedText>
          <ThemedText>About this app:</ThemedText>
          <ThemedText>This is an example application to help you get started.</ThemedText>
        </Animated.View>
      </Modal>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    
  }})