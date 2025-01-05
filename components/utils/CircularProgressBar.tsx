import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Circle, G, Text as SvgText } from 'react-native-svg';


const CircularProgressBar = ({ percentage, size = 100, strokeWidth = 10 }:any) => {

    const radius = (size - strokeWidth) / 2; // Calculate radius
    const circumference = 2 * Math.PI * radius; // Circumference of the circle
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e9ecef"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#31d1c9"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </G>
          {/* Centered Percentage Text */}
          <SvgText
            x={size / 2.2}
            y={size / 2}
            textAnchor="middle"
            dy=".4em"
            fontSize={size / 6}
            fill="#333"
            fontWeight="bold"
          >
            {percentage}%
          </SvgText>
        </Svg>
      </View>
    );
  };
  export default CircularProgressBar 