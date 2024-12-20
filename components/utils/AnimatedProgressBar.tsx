import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing } from "react-native";

interface Props{
    targetAmount: number;
  collectedAmount: number;
}
const ProgressBar = ({ collectedAmount, targetAmount }:Props) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  const percentage = Math.min(
    Math.floor((collectedAmount / targetAmount) * 100),
    100
  );
  
  useEffect(() => {
    // Animate the progress bar
    Animated.timing(progressAnim, {
      toValue: percentage,
      duration: 800,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false, // Required for width changes
    }).start();
  }, [percentage]);

  return (
    <View
      style={{
       
      
        borderRadius: 12,
        width:"50%",
        alignSelf:"center",
       

        
      }}
    >
   
      <View
        style={{
          height: 8,
          borderRadius: 10,
          backgroundColor: "#e0e0e0",
          borderColor:"#31d1c9",
          borderWidth:1,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            width: progressAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
            backgroundColor: "#31d1c9",
            borderRadius: 10,
          }}
        />
      </View>
     
    </View>
  );
};

export default ProgressBar;
